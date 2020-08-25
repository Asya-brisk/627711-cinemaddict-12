import {getPlurals} from "../utils.js";

const trimDescription = (description) => {
  return description.length > 139 ? description.substr(0, 139) + `...` : description;
};

export const createFilmCardTemplate = (film) => {
  const {poster, title, rating, releaseDate, duration, genres, description, comments, isInWatchList, isWatched, isFavorite} = film;

  const year = releaseDate.substr(-4);

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
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
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
