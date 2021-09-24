import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDecimalNumber = (min, max) => {
  return (min + (Math.random() * (max - min))).toFixed(1);
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const shuffleArray = (array) => {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const getRandomBoolean = () => (Math.random() > 0.5);

export const getPlurals = (count, variants) => {
  if (count === 1) {
    return variants[0];
  }

  return variants[1];
};

export const generateElements = (count, fn) => {
  return new Array(count)
    .fill(``)
    .map(fn);
};

export const getCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

export const generateFilmDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;

  return `${hours > 0 ? `${hours}h` : ``} ${minutes > 0 ? `${minutes}m` : ``}`;
};

