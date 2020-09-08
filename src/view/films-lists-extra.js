import AbstractView from "./abstract.js";

const createFilmsListsExtraTemplate = (listName) => {
  const getFilmsClass = (name) => {
    switch (name) {
      case `Top rated`:
        return `films-list--top_rated`;
      case `Most commented`:
        return `films-list--most_commented`;
      default:
        return ``;
    }
  };

  const filmClass = getFilmsClass(listName);

  return (
    `<section class="films-list--extra ${filmClass}">
      <h2 class="films-list__title">${listName}</h2>
    </section>`
  );
};

export default class FilmsListsExtra extends AbstractView {
  constructor(name) {
    super();
    this._name = name;
  }

  getTemplate() {
    return createFilmsListsExtraTemplate(this._name);
  }
}
