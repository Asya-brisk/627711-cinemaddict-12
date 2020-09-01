import {getRandomInteger, createElement} from "../utils";

const createFooterStatisticsTemplate = () => {
  return (`
    <p>${getRandomInteger(130291).toLocaleString()} movies inside</p>
  `);
};

export default class FooterStatistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate();
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
