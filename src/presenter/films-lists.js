import SortView from "../view/sort.js";
import FilmsContainerView from "../view/films-container.js";
import FilmsListView from "../view/films-list.js";
import FilmsListsExtraView from "../view/films-lists-extra.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import NoFilmsView from "../view/no-films.js";
import {getTopRatedFilms, getMostCommentedFilms} from "../utils/films.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType} from "../const.js";
import FilmPresenter from "./film.js";

const CARDS_COUNT_PER_STEP = 5;
export default class FilmsLists {
  constructor(filmsListsContainer) {
    this._filmsListsContainer = filmsListsContainer;
    this._renderedFilmCount = CARDS_COUNT_PER_STEP;
    this._filmPresenters = {
      allFilmsList: {},
      topRatingList: {},
      mostCommentedList: {},
    };
    this._currentSortType = SortType.DEFAULT;

    this._filmsComponent = new FilmsContainerView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedFilmsListComponent = new FilmsListsExtraView(`Top rated`);
    this._mostCommentedFilmsListComponent = new FilmsListsExtraView(`Most commented`);

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, userComments) {
    this._films = films.slice();
    this._userComments = userComments;
    this._sourcedFilms = films.slice();

    this._renderFilmsLists();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._films.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case SortType.BY_RATING:
        this._films.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _handleModeChange() {
    Object.values(this._filmPresenters).forEach((list) => {
      Object.values(list).forEach((presenter) => {
        presenter.resetFilmView();
      });
    });
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    Object
      .values(this._filmPresenters)
      .forEach((list) => {
        if (updatedFilm.id in list) {
          list[updatedFilm.id].init(updatedFilm);
        }
      });
  }

  _renderSort() {
    render(this._filmsListsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film, this._userComments);

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

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + CARDS_COUNT_PER_STEP);
    this._renderedFilmCount += CARDS_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenters.allFilmsList)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenters.allFilmsList = {};
    this._renderedFilmCount = CARDS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmsList() {
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, Math.min(this._films.length, CARDS_COUNT_PER_STEP));

    if (this._films.length > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    const topRatedFilms = getTopRatedFilms(this._films.slice());

    if (topRatedFilms.length > 0) {
      render(this._filmsComponent, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
      this._topRatedFilmsContainer = this._filmsComponent.getElement().querySelector(`.films-list--top_rated`).querySelector(`.films-list__container`);

      topRatedFilms.forEach((film) => this._renderFilm(this._topRatedFilmsContainer, film));
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = getMostCommentedFilms(this._films.slice());

    if (mostCommentedFilms.length > 0) {
      render(this._filmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      this._mostCommentedFilmsContainer = this._filmsComponent.getElement().querySelector(`.films-list--most_commented`).querySelector(`.films-list__container`);

      mostCommentedFilms.forEach((film) => this._renderFilm(this._mostCommentedFilmsContainer, film));
    }
  }

  _renderFilmsLists() {
    this._renderSort();

    render(this._filmsListsContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
