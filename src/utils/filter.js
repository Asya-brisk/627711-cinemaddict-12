import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.isFavorite),
};
