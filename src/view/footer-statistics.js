import {getRandomInteger} from "../utils";

export const createFooterStatisticsTemplate = () => {
  return (`
    <p>${getRandomInteger(130291).toLocaleString()} movies inside</p>
  `);
};
