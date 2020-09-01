import UserProfileView from "./view/user-profile.js";
import SiteMenuView from "./view/site-menu.js";
import SortView from "./view/sort.js";
import FilmsContainerView from "./view/films-container.js";
import FilmsListView from "./view/films-list.js";
import FilmsListsExtraView from "./view/films-lists-extra.js";
import FilmCardView from "./view/film-card.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmDetailsPopupView from "./view/film-details-popup.js";
import CommentsView from "./view/comments.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import NoFilmsView from "./view/no-films.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateRating} from "./mock/user-profile.js";
import {generateFilter} from "./mock/site-menu.js";
import {generateElements, render, RenderPosition, getTopRatedFilms, getMostCommentedFilms} from "./utils.js";

const CARD_COUNT = 20;
const CARDS_COUNT_PER_STEP = 5;

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const filmCard = generateFilmCard();
const filmCards = generateElements(CARD_COUNT, generateFilmCard);
const comments = filmCard.comments;
const filter = generateFilter(filmCards);
const rating = generateRating();

const renderFilmCard = (filmsListContainer, film, userComments) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
  const commentsComponent = new CommentsView(userComments);

  const commentsListElement = filmDetailsPopupComponent.getElement().querySelector(`.film-details__comments-list`);
  render(commentsListElement, commentsComponent.getElement(), RenderPosition.BEFOREEND);

  const cardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const cardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closePopup();
    }
  };

  const closePopup = () => {
    filmDetailsPopupComponent.getElement().remove();
    filmDetailsPopupComponent.removeElement();
    commentsComponent.getElement().remove();
    commentsComponent.removeElement();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onPopupCloseButtonClick = () => {
    closePopup();
  };

  const onFilmCardClick = () => {
    render(siteBodyElement, filmDetailsPopupComponent.getElement(), RenderPosition.BEFOREEND);

    const popupCloseButton = filmDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);

    popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  render(filmsListContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);

  cardPoster.addEventListener(`click`, onFilmCardClick);
  cardTitle.addEventListener(`click`, onFilmCardClick);
  cardComments.addEventListener(`click`, onFilmCardClick);
};

const filmsComponent = new FilmsContainerView();

const renderFilmsList = (films, userComments) => {
  const filmsListComponent = new FilmsListView();
  const filmsListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);

  render(siteMainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);

  if (films.length === 0) {
    render(filmsComponent.getElement(), new NoFilmsView().getElement(), RenderPosition.AFTERBEGIN);
  }

  render(filmsComponent.getElement(), filmsListComponent.getElement(), RenderPosition.AFTERBEGIN);

  films
    .slice(0, Math.min(films.length, CARDS_COUNT_PER_STEP))
    .forEach((film) => renderFilmCard(filmsListContainerElement, film, userComments));

  if (films.length > CARDS_COUNT_PER_STEP) {
    let renderedFilmCount = CARDS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + CARDS_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(filmsListContainerElement, film, userComments));

      renderedFilmCount += CARDS_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

const renderTopRatedFilms = (films, userComments) => {
  const topRatedFilms = getTopRatedFilms(films);
  if (topRatedFilms.length > 0) {
    render(filmsComponent.getElement(), new FilmsListsExtraView(`Top rated`).getElement(), RenderPosition.BEFOREEND);

    const topRatedFilmsElement = filmsComponent.getElement().querySelector(`.films-list--top_rated`).querySelector(`.films-list__container`);

    topRatedFilms.forEach((film) => renderFilmCard(topRatedFilmsElement, film, userComments));
  }
};

const renderMostCommentedFilms = (films, userComments) => {
  const mostCommentedFilms = getMostCommentedFilms(films);
  if (mostCommentedFilms.length > 0) {
    render(filmsComponent.getElement(), new FilmsListsExtraView(`Most commented`).getElement(), RenderPosition.BEFOREEND);

    const mostCommentedFilmsElement = filmsComponent.getElement().querySelector(`.films-list--most_commented`).querySelector(`.films-list__container`);

    mostCommentedFilms.forEach((film) => renderFilmCard(mostCommentedFilmsElement, film, userComments));
  }
};

render(siteHeaderElement, new UserProfileView(rating).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filter).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
renderFilmsList(filmCards, comments);
renderTopRatedFilms(filmCards, comments);
renderMostCommentedFilms(filmCards, comments);

render(footerStatisticsElement, new FooterStatisticsView().getElement(), RenderPosition.BEFOREEND);
