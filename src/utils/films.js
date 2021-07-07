export const getTopRatedFilms = (films) => {
  return films.sort((a, b) => b.rating - a.rating).slice(0, 2);
};

export const getMostCommentedFilms = (films) => {
  return films.sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);
};
