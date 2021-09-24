import SmartView from "./smart.js";
import {getPlurals, getCommentDate, generateFilmDuration} from "../utils/common.js";
import dayjs from "dayjs";
import {nanoid} from "nanoid";
import he from "he";
import {EMOJIS, FilmDetailsControlType, FilmCardControlsType} from "../const.js";

const createCommentsTemp = (comments) => {
  const userComments = comments.sort((a, b) => dayjs(b.date).diff() - dayjs(a.date).diff());
  const commentTemps = userComments.map((comment) => {
    const {id, emoji, message, name, date} = comment;
    const formatedDate = getCommentDate(date);

    return (
      `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
          </span>
          <div>
            <p class="film-details__comment-text">${message}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${name}</span>
              <span class="film-details__comment-day">${formatedDate}</span>
              <button class="film-details__comment-delete" data-id="${id}">Delete</button>
            </p>
          </div>
      </li>`
    );
  });

  return commentTemps.join(`\n`);
};

const createFilmDetailsEmojiTemplate = (currentEmotion) => {
  return EMOJIS.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${currentEmotion === emoji ? `checked` : ``}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`).join(`\n`);
};

const generateGenreTemplate = (elem) => {
  return (
    `<span class="film-details__genre">${elem}</span>`
  );
};

const createFilmDetailsPopupTemplate = (film) => {
  const {
    poster, ageRating, title, rating,
    director, writers, actors, releaseDate,
    duration, country, genres, description, comments,
    isInWatchList, isWatched, isFavorite, emotion, text
  } = film;

  const genresText = getPlurals(genres.length, [`Genre`, `Genres`]);
  const genresTemp = genres.map((genre) => generateGenreTemplate(genre)).join(`\n `);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${generateFilmDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genresText}</td>
                  <td class="film-details__cell">
                    ${genresTemp}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemp(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text ? text : ``)}</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createFilmDetailsEmojiTemplate(emotion)}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmDetailsPopup.parseFilmToData(film);
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._controlBtnClickHandler = this._controlBtnClickHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);
    this._newCommentSendBtnsDownHandler = this._newCommentSendBtnsDownHandler.bind(this);
    this._commentDeleteBtnClickHandler = this._commentDeleteBtnClickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emotionChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._textInputHandler);
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`keydown`, this._newCommentSendBtnsDownHandler);
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._controlBtnClickHandler);
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((button) => button.addEventListener(`click`, this._commentDeleteBtnClickHandler));
  }

  reset(film) {
    this.updateData(FilmDetailsPopup.parseFilmToData(film));
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({emotion: evt.target.value,
    });
  }

  _textInputHandler(evt) {
    evt.preventDefault();
    this.updateData({text: evt.target.value,
    }, true);
  }

  _newCommentSendBtnsDownHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) {
      if (!this._data.emotion || !this._data.text) {
        return;
      }

      const newComment = {
        id: nanoid(),
        emoji: this._data.emotion,
        message: this._data.text,
        name: ``,
        date: dayjs(),
      };

      this._data = FilmDetailsPopup.parseDataToComment(this._data, newComment);

      this.updateElement();
    }
  }

  _commentDeleteBtnClickHandler(evt) {
    evt.preventDefault();

    this._callback.deleteCommentBtnClick(evt.target.dataset.id);
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick(this._data);
  }

  _controlBtnClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.id === FilmDetailsControlType.WATCHLIST) {
      this._updateFilmCardData(FilmCardControlsType.IN_WATCHLIST);
    }

    if (evt.target.id === FilmDetailsControlType.WATCHED) {
      this._updateFilmCardData(FilmCardControlsType.IS_WATCHED);
    }

    if (evt.target.id === FilmDetailsControlType.FAVORITE) {
      this._updateFilmCardData(FilmCardControlsType.IS_FAVORITE);
    }
  }

  _updateFilmCardData(updateValue) {
    this.updateData({[updateValue]: !this._data[updateValue],
    });
  }

  setСommentDeleteBtnClickHandler(callback) {
    this._callback.deleteCommentBtnClick = callback;
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;

    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
  }

  static parseFilmToData(filmCard) {
    return Object.assign({}, filmCard, {
      emotion: null,
      text: ``,
    });
  }

  static parseDataToComment(data, userComment) {
    data = Object.assign({}, data);
    data.comments.push(userComment);

    delete data.emotion;
    delete data.text;
    return data;
  }
}
