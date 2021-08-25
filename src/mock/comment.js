import {EMOJIS} from "../const.js";
import {getRandomArrayItem, getRandomDate} from "../utils/common.js";
import {nanoid} from 'nanoid';
import dayjs from "dayjs";

const generateCommentDate = () => {
  const commentRandomDate = getRandomDate(new Date(2017, 0, 1), new Date());

  const commentDate = dayjs(commentRandomDate).format(`YYYY/MM/DD HH:mm`);

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
    id: nanoid(),
    emoji: getRandomArrayItem(EMOJIS),
    message: getRandomArrayItem(userMessages),
    name: getRandomArrayItem(userNames),
    date: generateCommentDate(),
  };
};
