import {getRandomInteger} from "../utils/common.js";
import {PROFILE_RATINGS} from "../const.js";

export const generateRating = () => {
  let ratingValue = getRandomInteger(0, 30);

  const getProfileRating = (rating) => {
    switch (rating) {
      case (rating !== 0) && (rating <= 10):
        return PROFILE_RATINGS[0];
      case (rating > 10) && (rating <= 20):
        return PROFILE_RATINGS[1];
      case rating > 20:
        return PROFILE_RATINGS[2];
      default:
        return ``;
    }
  };

  const profileRating = getProfileRating(ratingValue);

  return profileRating;
};
