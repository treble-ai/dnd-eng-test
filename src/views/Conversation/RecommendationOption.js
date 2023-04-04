import React, { useState } from "react";
import "./RecommendationOption.scss";

import getLanguage from "getLanguage.js";
import languages from "./languages.js";
const language = languages[getLanguage()];

const RecommendationOption = (props) => {
  const [hovered, setHovered] = useState(false);

  const renderComponent = () => {
    let points = props.points;
    if (points < 10) {
      points = `0${points}`;
    }

    return (
      <div className="option-container">
        <div className="description">
          <p> {props.label} </p>
        </div>
        <div className="points-container">
          <div className="points">
            <p>{`+${points} ${language.score}`}</p>
          </div>
          <div className={`compliance-icon ${props.completeStatus}`}></div>
        </div>
      </div>
    );
  };

  const renderHoverComponent = () => {
    return (
      <div className="know-more">
        <p>{language.knowMore}</p>
      </div>
    );
  };

  return (
    <div
      className="global-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        props.onClick();
      }}
    >
      {hovered && renderHoverComponent()}
      {renderComponent()}
    </div>
  );
};

export default RecommendationOption;
