import {createElement} from "../utils.js";

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
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmsListsExtra {
  constructor(name) {
    this._name = name;

    this._element = null;
  }

  getTemplate() {
    return createFilmsListsExtraTemplate(this._name);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
