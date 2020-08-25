import {getRandomInteger, getRandomDecimalNumber, getRandomArrayItem, shuffleArray, getRandomBoolean, getRandomDate, generateElements} from "../utils.js";
import {TEXT, POSTERS, FILM_NAMES, NAMES, COUNTRIES, GENRES, AGE_RATINGS} from "../const.js";
import {generateComment} from "./comment.js";

const generateReleaseDate = () => {
  const releaseRandomDate = getRandomDate(new Date(1940, 1, 1), new Date(1999, 1, 1));

  const options = {
    year: `numeric`,
    month: `long`,
    day: `2-digit`,
  };

  const releaseDate = releaseRandomDate.toLocaleString(`en-GB`, options);

  return releaseDate;
};

const generateFilmDuration = () => {
  const hours = getRandomInteger(0, 2);
  const minutes = getRandomInteger(0, 59);

  return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
};

const generateDescription = () => {
  let sentences = TEXT.split(`. `);

  const count = getRandomInteger(1, 5);
  let filmDescription = ``;

  for (let i = 0; i < count; i++) {
    filmDescription += getRandomArrayItem(sentences) + `. `;
  }

  const description = filmDescription.slice(0, -1);

  return description;
};

export const generateFilmCard = () => {
  const commentsNum = getRandomInteger(0, 5);

  return {
    poster: getRandomArrayItem(POSTERS),
    title: getRandomArrayItem(FILM_NAMES),
    rating: getRandomDecimalNumber(0, 10),
    releaseDate: generateReleaseDate(),
    duration: generateFilmDuration(),
    genres: shuffleArray(GENRES).slice(0, getRandomInteger(1, 4)),
    description: generateDescription(),
    comments: generateElements(commentsNum, generateComment),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    director: getRandomArrayItem(NAMES),
    writers: shuffleArray(NAMES).slice(0, getRandomInteger(2, 4)).join(`, `),
    actors: shuffleArray(NAMES).slice(0, getRandomInteger(2, 4)).join(`, `),
    country: getRandomArrayItem(COUNTRIES),
    isInWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    commentsNum,
  };
};
