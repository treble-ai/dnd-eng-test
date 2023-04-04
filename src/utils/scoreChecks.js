export const TWO_BLOCK_MINIMUM = "TWO_BLOCK_MINIMUM";
export const BUTTONS_BLOCK = "BUTTONS_BLOCK";
export const GOAL_BLOCK = "GOAL_BLOCK";
export const EMOJIS = "EMOJIS";
export const NOT_INCLUDED_ANSWER = "NOT_INCLUDED_ANSWER";
export const SHORT_TEXT = "SHORT_TEXT";

const withEmojis = /\p{Extended_Pictographic}/u;
export const checkEmoji = (text) => {
  return withEmojis.test(text);
};

const shortTextLength = 512;
export const checkShortText = (text) => {
  return text.length <= shortTextLength;
};

export const checkGoalBlock = (node) => {
  return node.getGoalMeasurement().targetEvents.length > 0;
};

export const checkDefaultAnswer = (node) => {
  const defaultClosedAnswerPort = node.getDefaultClosedAnswerPort();
  if (!defaultClosedAnswerPort) {
    return false;
  }
  return Object.keys(defaultClosedAnswerPort.getLinks()).length > 0;
};
