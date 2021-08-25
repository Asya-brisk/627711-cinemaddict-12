import FilmCardView from "../view/film-card.js";
import FilmDetailsPopupView from "../view/film-details-popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {FilmDetailsMode, FilmCardControlsType, UserAction, UpdateType} from "../const.js";

const siteBodyElement = document.querySelector(`body`);

export default class Film {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._film = null;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._filmDetailsMode = FilmDetailsMode.CLOSE;
    this._isChangeComment = false;

    this._handlePopupButtonClose = this._handlePopupButtonClose.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWathchedClick = this._handleMarkAsWathchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;
    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(this._film);

    this._filmCardComponent.setCardElementsClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setAddToWatchedClickHandler(this._handleMarkAsWathchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetailsPopupComponent.setCloseBtnClickHandler(this._handlePopupButtonClose);
    this._filmDetailsPopupComponent.setСommentDeleteBtnClickHandler(this._handleDeleteComment);

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmsListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmDetailsMode === FilmDetailsMode.CLOSE) {
      replace(this._filmCardComponent, prevFilmCardComponent);
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
    document.removeEventListener(`keydown`, this._onEscKeyDownHandler);
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
    this._filmDetailsPopupComponent.reset(this._film);
    document.body.style.overflow = ``;
    if (this._isChangeComment) {
      this._isChangeComment = false;
    }
  }

  _openPopup() {
    render(siteBodyElement, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    document.body.style.overflow = `hidden`;
  }

  _handleDeleteComment(commnetId) {
    this._scroll = this._filmDetailsPopupComponent.getElement().scrollTop;
    const deletedComments = this._film.comments.filter((comment) => comment.id !== commnetId);

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments: deletedComments,
            }
        ),
        this._filmDetailsMode);

    this._filmDetailsPopupComponent.getElement().scrollTop = this._scroll;
    this._isChangeComment = true;
  }

  _handlePopupButtonClose(update) {
    this._changeData(
        UserAction.UPDATE_FILM,
        this._film !== update || this._isChangeComment === true ? UpdateType.MINOR : UpdateType.NONUPDATE,
        update
    );

    this._closePopup();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._openPopup();
    this._filmDetailsMode = FilmDetailsMode.OPEN;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _updateFilmData(updateValue) {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              [updateValue]: !this._film[updateValue],
            }
        )
    );
  }

  _handleAddToWatchListClick() {
    this._updateFilmData(FilmCardControlsType.IN_WATCHLIST);
  }

  _handleMarkAsWathchedClick() {
    this._updateFilmData(FilmCardControlsType.IS_WATCHED);
  }

  _handleFavoriteClick() {
    this._updateFilmData(FilmCardControlsType.IS_FAVORITE);
  }
}
