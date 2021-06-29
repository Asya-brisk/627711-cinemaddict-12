import FilmCardView from "../view/film-card.js";
import FilmDetailsPopupView from "../view/film-details-popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";

const siteBodyElement = document.querySelector(`body`);

const FilmDetailsMode = {
  OPEN: `open`,
  CLOSE: `close`,
};

const FilmDetailsControlType = {
  FAVORITE: `favorite`,
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
};

const FilmCardControlsType = {
  IN_WATCHLIST: `isInWatchList`,
  IS_WATCHED: `isWatched`,
  IS_FAVORITE: `isFavorite`,
};

export default class Film {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._filmDetailsMode = FilmDetailsMode.CLOSE;

    this._handlePopupButtonClose = this._handlePopupButtonClose.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWathchedClick = this._handleMarkAsWathchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePopupControlBtnChange = this._handlePopupControlBtnChange.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;
    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(film);

    this._filmCardComponent.setCardElementsClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setAddToWatchedClickHandler(this._handleMarkAsWathchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmsListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmsListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmDetailsMode === FilmDetailsMode.OPEN) {
      this._filmDetailsPopupComponent = prevFilmDetailsPopupComponent;
      return;
    }

    if (siteBodyElement.contains(prevFilmDetailsPopupComponent.getElement())) {
      replace(this._filmDetailsPopupComponent, prevFilmDetailsPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }

  resetFilmView() {
    if (this._filmDetailsMode !== FilmDetailsMode.CLOSE) {
      this._closePopup();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._filmDetailsPopupComponent);
    this._filmDetailsMode = FilmDetailsMode.CLOSE;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _openPopup() {
    render(siteBodyElement, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    this._filmDetailsPopupComponent.setCloseBtnClickHandler(this._handlePopupButtonClose);
    this._filmDetailsPopupComponent.setControlBtnClickHandler(this._handlePopupControlBtnChange);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._filmDetailsMode = FilmDetailsMode.OPEN;
  }

  _handlePopupButtonClose() {
    this._closePopup();
  }

  _handleFilmCardClick() {
    this._openPopup();
  }

  _handlePopupControlBtnChange(inputType) {
    if (inputType === FilmDetailsControlType.WATCHLIST) {
      this._updateFilmCardData(FilmCardControlsType.IN_WATCHLIST);
    }

    if (inputType === FilmDetailsControlType.WATCHED) {
      this._updateFilmCardData(FilmCardControlsType.IS_WATCHED);
    }

    if (inputType === FilmDetailsControlType.FAVORITE) {
      this._updateFilmCardData(FilmCardControlsType.IS_FAVORITE);
    }
  }

  _updateFilmCardData(updateValue) {
    this._changeData(Object.assign({}, this._film, {[updateValue]: !this._film[updateValue]}), this._filmDetailsMode);
  }

  _handleAddToWatchListClick() {
    this._updateFilmCardData(FilmCardControlsType.IN_WATCHLIST);
  }

  _handleMarkAsWathchedClick() {
    this._updateFilmCardData(FilmCardControlsType.IS_WATCHED);
  }

  _handleFavoriteClick() {
    this._updateFilmCardData(FilmCardControlsType.IS_FAVORITE);
  }
}
