import SortView from "../view/sort.js";
import FilmsContainerView from "../view/films-container.js";
import FilmsListView from "../view/films-list.js";
import FilmsListsExtraView from "../view/films-lists-extra.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import NoFilmsView from "../view/no-films.js";
import {getTopRatedFilms, getMostCommentedFilms} from "../utils/films.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import FilmPresenter from "./film.js";

const CARDS_COUNT_PER_STEP = 5;
export default class FilmsLists {
  constructor(filmsListsContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsListsContainer = filmsListsContainer;
    this._renderedFilmCount = CARDS_COUNT_PER_STEP;
    this._filmPresenters = {
      allFilmsList: {},
      topRatingList: {},
      mostCommentedList: {},
    };
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsComponent = new FilmsContainerView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsComponent = new NoFilmsView();
    this._topRatedFilmsListComponent = new FilmsListsExtraView(`Top rated`);
    this._mostCommentedFilmsListComponent = new FilmsListsExtraView(`Most commented`);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsLists();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort((a, b) => b.releaseYear - a.releaseYear);
      case SortType.BY_RATING:
        return filteredFilms.sort((a, b) => b.rating - a.rating);
    }

    return filteredFilms;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList({resetRenderedFilmCount: true});
    this._renderFilmsLists();
  }

  _handleModeChange() {
    Object.values(this._filmPresenters).forEach((list) => {
      Object.values(list).forEach((presenter) => {
        presenter.resetFilmView();
      });
    });
  }

  _handleViewAction(actionType, updateType, update, popupMode) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.update(updateType, update, popupMode);
        break;
    }
  }

  _handleModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case UpdateType.PATCH:
        Object
      .values(this._filmPresenters)
      .forEach((list) => {
        if (updatedFilm.id in list) {
          list[updatedFilm.id].init(updatedFilm);
        }
      });
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderFilmsLists();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsLists();
        break;
      case UpdateType.NONUPDATE:
        break;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsListsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._setActivePopupState);
    filmPresenter.init(film);

    switch (container) {
      case this._filmsListContainerComponent:
        this._filmPresenters.allFilmsList[film.id] = filmPresenter;
        break;
      case this._topRatedFilmsContainer:
        this._filmPresenters.topRatingList[film.id] = filmPresenter;
        break;
      case this._mostCommentedFilmsContainer:
        this._filmPresenters.mostCommentedList[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + CARDS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmsList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object.values(this._filmPresenters).forEach((list) => {
      Object.values(list).forEach((presenter) => {
        presenter.destroy();
      });
    });

    this._filmPresenters.allFilmsList = {};
    this._filmPresenters.topRatingList = {};
    this._filmPresenters.mostCommentedList = {};


    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsList() {
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, CARDS_COUNT_PER_STEP));

    this._renderFilms(films);

    if (filmCount > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    const topRatedFilms = getTopRatedFilms(this._getFilms().slice());

    if (topRatedFilms.length > 0) {
      render(this._filmsComponent, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
      this._topRatedFilmsContainer = this._filmsComponent.getElement().querySelector(`.films-list--top_rated`).querySelector(`.films-list__container`);

      topRatedFilms.forEach((film) => this._renderFilm(this._topRatedFilmsContainer, film));
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = getMostCommentedFilms(this._getFilms().slice());

    if (mostCommentedFilms.length > 0) {
      render(this._filmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      this._mostCommentedFilmsContainer = this._filmsComponent.getElement().querySelector(`.films-list--most_commented`).querySelector(`.films-list__container`);

      mostCommentedFilms.forEach((film) => this._renderFilm(this._mostCommentedFilmsContainer, film));
    }
  }

  _renderFilmsLists() {
    this._renderSort();

    render(this._filmsListsContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
