import UserProfileView from "./view/user-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import FilmsListsPresenter from "./presenter/films-lists.js";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateElements} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";

const CARD_COUNT = 30;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const filmCards = generateElements(CARD_COUNT, generateFilmCard);

const profileView = new UserProfileView();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);
profileView.setData(filmsModel.getFilms());

render(siteHeaderElement, profileView, RenderPosition.BEFOREEND);

const filmsListsPresenter = new FilmsListsPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();

filmsListsPresenter.init();

render(footerStatisticsElement, new FooterStatisticsView(), RenderPosition.BEFOREEND);
