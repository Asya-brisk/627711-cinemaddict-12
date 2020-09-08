import SortView from "../view/sort.js";
import FilmsContainerView from "../view/films-container.js";
import FilmsListView from "../view/films-list.js";
import FilmsListsExtraView from "../view/films-lists-extra.js";
import FilmsListContainerView from "../view/film-card.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmDetailsPopupView from "../view/film-details-popup.js";
import CommentsView from "../view/comments.js";
import NoFilmsView from "../view/no-films.js";
import {getTopRatedFilms, getMostCommentedFilms} from "../utils/films.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType} from "../const.js";

const CARDS_COUNT_PER_STEP = 5;

const siteBodyElement = document.querySelector(`body`);

export default class FilmsLists {
  constructor(filmsListsContainer) {
    this._filmsListsContainer = filmsListsContainer;
    this._renderedFilmCount = CARDS_COUNT_PER_STEP;

    this._filmsComponent = new FilmsContainerView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedFilmsListComponent = new FilmsListsExtraView(`Top rated`);
    this._mostCommentedFilmsListComponent = new FilmsListsExtraView(`Most commented`);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, userComments) {
    this._films = films.slice();
    this._userComments = userComments;
    this._sourcedFilms = films.slice();

    this._renderSort();
    this._renderFilmsList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._films.sort((a, b) => b.releaseDate - a.releaseDate);
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

  _renderSort() {
    render(this._filmsListsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(filmsListContainer, film) {
    const filmCardComponent = new FilmCardView(film);
    const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
    const commentsComponent = new CommentsView(this._userComments);

    const commentsListElement = filmDetailsPopupComponent.querySelector(`.film-details__comments-list`);
    render(commentsListElement, commentsComponent, RenderPosition.BEFOREEND);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        closePopup();
      }
    };

    const closePopup = () => {
      remove(filmDetailsPopupComponent);
      remove(commentsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onFilmCardClick = () => {
      render(siteBodyElement, filmDetailsPopupComponent, RenderPosition.BEFOREEND);

      filmDetailsPopupComponent.setCloseBtnClickHandler(closePopup);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    render(filmsListContainer, filmCardComponent, RenderPosition.BEFOREEND);

    filmCardComponent.setCardElementsClickHandler(onFilmCardClick);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film, this._userComments));
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
    this._filmsListComponent.getElement().innerHTML = ``;
    this._renderedTaskCount = CARDS_COUNT_PER_STEP;
  }

  _renderFilmsList() {
    render(this._filmsListsContainer, this._filmsComponent, RenderPosition.BEFOREEND);

    if (this._films.length === 0) {
      this._renderNoFilms();
    }

    render(this._filmsComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, Math.min(this._films.length, CARDS_COUNT_PER_STEP));

    if (this._films.length > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    const topRatedFilms = getTopRatedFilms(this._films);

    if (topRatedFilms.length > 0) {
      render(this._filmsComponent, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

      const topRatedFilmsContainer = render(this._topRatedFilmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

      topRatedFilms.forEach((film) => this._renderFilm(topRatedFilmsContainer, film, this._userComments));
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = getMostCommentedFilms(this._films);

    if (mostCommentedFilms.length > 0) {
      render(this._filmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

      const mostCommentedFilmsContainer = render(this._mostCommentedFilmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

      mostCommentedFilms.forEach((film) => this._renderFilm(mostCommentedFilmsContainer, film, this._userComments));
    }
  }
}
