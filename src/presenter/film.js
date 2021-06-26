import FilmCardView from "../view/film-card.js";
import FilmDetailsPopupView from "../view/film-details-popup.js";
import {render, RenderPosition, remove} from "../utils/render.js";

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
    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(film);

    this._filmCardComponent.setCardElementsClickHandler(this._handleFilmCardClick);

    render(this._filmsListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
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
