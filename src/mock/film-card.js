import {getRandomInteger, getRandomDecimalNumber, getRandomArrayItem, shuffleArray, getRandomBoolean, getRandomDate, generateElements} from "../utils/common.js";
import {TEXT, POSTERS, FILM_NAMES, NAMES, COUNTRIES, GENRES, AGE_RATINGS} from "../const.js";
import {generateComment} from "./comment.js";
import dayjs from "dayjs";
import {nanoid} from "nanoid";

const DaysGap = {
  MIN: 0,
  MAX: 364,
};

const generateReleaseDate = () => {
  const releaseRandomDate = getRandomDate(new Date(1940, 1, 1), new Date(1999, 1, 1));

  return dayjs(releaseRandomDate).format(`DD MMMM YYYY`);
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

const generateWatchingDate = () => {
  const daysGap = getRandomInteger(DaysGap.MIN, DaysGap.MAX);
  return dayjs().subtract(daysGap, `day`);
};

export const generateFilmCard = () => {
  const commentsNum = getRandomInteger(0, 10);
  const filmsReleaseDate = generateReleaseDate();

  return {
    id: nanoid(),
    poster: getRandomArrayItem(POSTERS),
    title: getRandomArrayItem(FILM_NAMES),
    rating: getRandomDecimalNumber(0, 10),
    releaseDate: filmsReleaseDate,
    releaseYear: filmsReleaseDate.substr(-4),
    duration: getRandomInteger(60, 250),
    genres: shuffleArray(GENRES).slice(0, getRandomInteger(1, 4)),
    description: generateDescription(),
    comments: generateElements(commentsNum, generateComment),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    director: getRandomArrayItem(NAMES),
    writers: shuffleArray(NAMES).slice(0, getRandomInteger(2, 4)).join(`, `),
    actors: shuffleArray(NAMES).slice(0, getRandomInteger(2, 4)).join(`, `),
    country: getRandomArrayItem(COUNTRIES),
    isInWatchList: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    watchingDate: generateWatchingDate(),
  };
};
