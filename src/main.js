import {createUserProfileTemplate} from "./view/user-profile.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsContainerTemplate} from "./view/films-container.js";
import {createFilmsListsExtraTemplate} from "./view/films-lists-extra.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmDetailsPopupTemplate} from "./view/film-details-popup.js";
import {createFooterStatisticsTemplate} from "./view/footer-statistics.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateRating} from "./mock/user-profile.js";
import {generateFilter} from "./mock/site-menu.js";
import {generateElements} from "./utils.js";


const CARD_COUNT = 20;
const EXTRA_CARD_COUNT = 2;
const CARDS_COUNT_PER_STEP = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const films = generateElements(CARD_COUNT, generateFilmCard);
const filter = generateFilter(films);
const rating = generateRating();

render(siteHeaderElement, createUserProfileTemplate(rating), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(filter), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsContainerTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainer = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, CARDS_COUNT_PER_STEP); i++) {
  render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

if (films.length > CARDS_COUNT_PER_STEP) {
  let renderedFilmCount = CARDS_COUNT_PER_STEP;

  render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

  const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + CARDS_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += CARDS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const topRatedFilms = films
  .filter((film) => film.rating > 0)
  .sort((a, b) => {
    return (b.rating - a.rating);
  });

if (topRatedFilms.length > 0) {
  render(filmsElement, createFilmsListsExtraTemplate(`Top rated`), `beforeend`);

  const topRatedFilmsElement = filmsElement.querySelector(`.films-list--top_rated`).querySelector(`.films-list__container`);

  topRatedFilms.slice(0, EXTRA_CARD_COUNT)
  .forEach((film) => render(topRatedFilmsElement, createFilmCardTemplate(film), `beforeend`));
}

const mostCommentedFilms = films
  .filter((film) => film.commentsNum > 0)
  .sort((a, b) => {
    return (b.commentsNum - a.commentsNum);
  });

if (mostCommentedFilms.length > 0) {
  render(filmsElement, createFilmsListsExtraTemplate(`Most commented`), `beforeend`);

  const mostCommentedFilmsElement = filmsElement.querySelector(`.films-list--most_commented`).querySelector(`.films-list__container`);

  mostCommentedFilms.slice(0, EXTRA_CARD_COUNT)
  .forEach((film) => render(mostCommentedFilmsElement, createFilmCardTemplate(film), `beforeend`));
}

render(footerStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);

//render(siteBodyElement, createFilmDetailsPopupTemplate(films[0]), `beforeend`);

