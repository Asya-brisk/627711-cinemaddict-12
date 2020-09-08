import AbstractView from "./abstract.js";
import {getRandomInteger} from "../utils/common.js";

const createFooterStatisticsTemplate = () => {
  return (
    `<p>${getRandomInteger(130291).toLocaleString()} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractView {
  getTemplate() {
    return createFooterStatisticsTemplate();
  }
}
