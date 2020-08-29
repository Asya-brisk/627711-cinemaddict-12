import {createElement} from "../utils.js";

const createCommentTemp = (comment) => {
  const {emoji, message, name, date} = comment;

  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
            <p class="film-details__comment-text">${message}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${name}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
        </div>
    </li>`
  );
};

const createCommentsTemplate = (comments) => {
  const commentsTemp = comments.map((comment) => createCommentTemp(comment)).join(`\n `);

  return commentsTemp;
};

export default class Comments {
  constructor(comments) {
    this._comments = comments;

    this._element = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
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
