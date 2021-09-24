import {ProfileRank} from "../const.js";

export const generateProfileRank = (count) => {
  if (count !== 0 && count <= 10) {
    return ProfileRank.NOVICE;
  }

  if (count > 10 && count <= 20) {
    return ProfileRank.FAN;
  }

  if (count > 20) {
    return ProfileRank.MOVIE_BUFF;
  }

  return ProfileRank.UNRANKED;
};

export const generateWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};
