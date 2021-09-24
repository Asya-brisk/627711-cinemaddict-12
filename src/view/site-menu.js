import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";


const createFilterItemTemplate = (filter, currentType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${type}" data-filter="${type}" class="main-navigation__item ${type === currentType ? `main-navigation__item--active` : ``}">
    ${name === `All` ? `All movies` : `${name} <span class="main-navigation__item-count ${count > 25 ? `visually-hidden` : ``}">${count}</span>`}</a>`
  );
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" data-filter="${FilterType.STATS}" class="main-navigation__additional ${currentFilterType === FilterType.STATS ?
      `main-navigation__additional--active` : ``}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;

    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    const isNavigation = evt.target.classList.contains(`main-navigation__item`) ||
    evt.target.classList.contains(`main-navigation__additional`);

    if (!isNavigation) {
      return;
    }

    this._callback.filterTypeClick(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
