import UserProfileView from "./view/user-profile.js";
import SiteMenuView from "./view/site-menu.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import FilmsListsPresenter from "./presenter/films-lists.js";
import {generateRating} from "./mock/user-profile.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateFilter} from "./mock/site-menu.js";
import {generateElements} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";

const CARD_COUNT = 20;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const filmCards = generateElements(CARD_COUNT, generateFilmCard);
const filter = generateFilter(filmCards);
const rating = generateRating();

const filmsListsPresenter = new FilmsListsPresenter(siteMainElement);

render(siteHeaderElement, new UserProfileView(rating), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filter), RenderPosition.BEFOREEND);
filmsListsPresenter.init(filmCards);

render(footerStatisticsElement, new FooterStatisticsView(), RenderPosition.BEFOREEND);
