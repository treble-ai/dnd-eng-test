import parse from "react-html-parser";

const WHATSAPP_FORMATS = [
  {
    htmlOp: "<b>",
    htmlEnd: "</b>",
    replaceCharacter: "*",
  },
  {
    htmlOp: "<i>",
    htmlEnd: "</i>",
    replaceCharacter: "_",
  },
  {
    htmlOp: "<s>",
    htmlEnd: "</s>",
    replaceCharacter: "~",
  },
  {
    htmlOp: "<tt>",
    htmlEnd: "</tt>",
    replaceCharacter: "```",
  },
];

export const formatText = (text) => {
  if (!text) return "";

  WHATSAPP_FORMATS.map((format) => {
    text = whatsappStyles(
      text,
      format.replaceCharacter,
      format.htmlOp,
      format.htmlEnd
    );
  });

  text = text.replaceAll("\n", "<br>");

  return parse(text);
};

const replaceStringAfterIndex = (text, search, replace, from) => {
  if (text.length > from) {
    return text.slice(0, from) + text.slice(from).replace(search, replace);
  }
  return text;
};

const whatsappStyles = (text, wildcard, opTag, clTag) => {
  const indices = [];
  let insideVariable = false;
  for (let i = 0; i < text.length; i++) {
    if (text.slice(i, 2) == "{{") {
      insideVariable = true;
    } else if (text.slice(i, 2) == "}}") {
      insideVariable = false;
    }
    if (!insideVariable && text.slice(i, i + wildcard.length) == wildcard) {
      indices.push(i);
    } else if (text[i].charCodeAt() == 10) {
      insideVariable = false;
      if (indices.length % 2) {
        indices.pop();
      }
    }
  }
  if (indices.length % 2) {
    indices.pop();
  }

  let newCharactersCounter = 0;
  indices.map((index, i) => {
    const tag = i % 2 ? clTag : opTag;
    const realIndex = index + newCharactersCounter;
    text = replaceStringAfterIndex(text, wildcard, tag, realIndex);
    newCharactersCounter += tag.length - wildcard.length;
  });
  return text;
};
