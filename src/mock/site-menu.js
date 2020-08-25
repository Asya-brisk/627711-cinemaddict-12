const siteMenuFilterMap = {
  watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  favorite: (films) => films.filter((film) => film.isFavorite).length
};

export const generateFilter = (films) => {
  return Object.entries(siteMenuFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
