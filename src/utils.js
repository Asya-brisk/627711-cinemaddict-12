const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomDecimalNumber = (min, max) => {
  return (min + (Math.random() * (max - min))).toFixed(1);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const shuffleArray = (array) => {
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

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomBoolean = () => (Math.random() > 0.5);

const getPlurals = (count, variants) => {
  if (count === 1) {
    return variants[0];
  }

  return variants[1];
};

const generateElements = (count, fn) => {
  return new Array(count)
    .fill(``)
    .map(fn);
};

const getTopRatedFilms = (films) => {
  return films.sort((a, b) => b.rating - a.rating).slice(0, 2);
};

const getMostCommentedFilms = (films) => {
  return films.sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);
};

export {
  getRandomInteger,
  getRandomDecimalNumber,
  getRandomArrayItem,
  shuffleArray,
  getRandomDate,
  getRandomBoolean,
  getPlurals,
  generateElements,
  RenderPosition,
  render,
  renderTemplate,
  createElement,
  getTopRatedFilms,
  getMostCommentedFilms,
};
