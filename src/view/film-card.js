import AbstractView from "./abstract.js";
import {getPlurals, generateFilmDuration} from "../utils/common.js";

const trimDescription = (description) => {
  return description.length > 139 ? description.substr(0, 139) + `...` : description;
};

export const createFilmCardTemplate = (film) => {
  const {poster, title, rating, releaseYear, duration, genres, description, comments, isInWatchList, isWatched, isFavorite} = film;

  const shortDescription = trimDescription(description);

  const commentsText = getPlurals(comments.length, [`comment`, `comments`]);

  const watchListClassName = isInWatchList
    ? `film-card__controls-item--active`
    : ``;

  const watchedClassName = isWatched
    ? `film-card__controls-item--active`
    : ``;

  const favoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${generateFilmDuration(duration)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} ${commentsText}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchListClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._cardElementsClickHandler = this._cardElementsClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._addToWatchedClickHandler = this._addToWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _cardElementsClickHandler(evt) {
    evt.preventDefault();
    this._callback.cardElementsClick();
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatcListClick();
  }

  _addToWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setCardElementsClickHandler(callback) {
    this._callback.cardElementsClick = callback;

    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._cardElementsClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._cardElementsClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._cardElementsClickHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatcListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addToWatchListClickHandler);
  }

  setAddToWatchedClickHandler(callback) {
    this._callback.addToWatchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._addToWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
