import {EMOJIS} from "../const.js";
import {getRandomArrayItem, getRandomDate} from "../utils.js";

const generateCommentDate = () => {
  const commentRandomDate = getRandomDate(new Date(2015, 0, 1), new Date());

  const options = {
    year: `numeric`,
    month: `2-digit`,
    day: `2-digit`,
    hour: `numeric`,
    minute: `numeric`,
  };

  const commentDate = commentRandomDate.toLocaleString(`en-ZA`, options);

  return commentDate;
};

export const generateComment = () => {
  const userMessages = [
    `Interesting setting and a good cast`,
    `Boooooring`,
    `Very very old.`,
    `One of my favorite movies`,
    `Dull and long`
  ];

  const userNames = [
    `Tim Macoveev`,
    `John Doe`,
    `Anne Shirley`,
    `Nancy Potter`,
    `Tom Smith`
  ];

  return {
    emoji: getRandomArrayItem(EMOJIS),
    message: getRandomArrayItem(userMessages),
    name: getRandomArrayItem(userNames),
    date: generateCommentDate(),
  };
};
