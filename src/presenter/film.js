import FilmCardView from "../view/film-card.js";
import FilmDetailsPopupView from "../view/film-details-popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";

const siteBodyElement = document.querySelector(`body`);

export default class Film {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;

    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;

    this._handlePopupButtonClose = this._handlePopupButtonClose.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;
    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(film);

    this._filmCardComponent.setCardElementsClickHandler(this._handleFilmCardClick);

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmsListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmsListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
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
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _openPopup() {
    render(siteBodyElement, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    this._filmDetailsPopupComponent.setCloseBtnClickHandler(this._handlePopupButtonClose);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handlePopupButtonClose() {
    this._closePopup();
  }

  _handleFilmCardClick() {
    this._openPopup();
  }
}
