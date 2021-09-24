import SmartView from "./smart.js";
import {generateProfileRank, generateWatchedFilms} from "../utils/statistics.js";


const createUserProfileTemplate = (films) => {
  const watchedFilms = generateWatchedFilms(films);
  const profileRating = generateProfileRank(watchedFilms.length);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile extends SmartView {
  constructor() {
    super();
    this._data = null;
  }

  setData(data) {
    this._data = data.slice();
  }

  getTemplate() {
    return createUserProfileTemplate(this._data);
  }

  updateData(data) {
    this._data = data.slice();
    this.updateElement();
  }
}
