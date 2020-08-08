import {createUserProfileTemplate} from "./view/user-profile.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createTopRatedFilmCardTemplate} from "./view/top-rated-film-card.js";
import {createMostCommentedFilmCardTemplate} from "./view/most-commented-film-card.js";
import {createFilmDetailsPopupTemplate} from "./view/film-details-popup.js";

const CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainers = filmsElement.querySelectorAll(`.films-list__container`);

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

for (let i = 0; i < CARD_COUNT; i++) {
  render(filmsListContainers[0], createFilmCardTemplate(), `beforeend`);
}

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  render(filmsListContainers[1], createTopRatedFilmCardTemplate(), `beforeend`);
}

for (let i = 0; i < EXTRA_CARD_COUNT; i++) {
  render(filmsListContainers[2], createMostCommentedFilmCardTemplate(), `beforeend`);
}

render(footerElement, createFilmDetailsPopupTemplate(), `afterend`);
