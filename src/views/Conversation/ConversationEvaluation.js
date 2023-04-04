import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import getLanguage from "getLanguage.js";
import languages from "./languages.js";
import "./ConversationEvaluation.scss";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import RecommendationOption from "./RecommendationOption";
import SelectDropdownV2 from "Components/SelectDropdownV2";
import { checkEmoji } from "utils/scoreChecks";
import events from "utils/events";
import types from "./duck/types";
import constants from "assets/constants.js";

const language = languages[getLanguage()];

const recommendationOptions = {
  BUTTONS_BLOCK: {
    label: language.BUTTONS_BLOCKtitle,
    normalScore: 40,
    advancedScore: 30,
  },
  GOAL_BLOCK: {
    label: language.GOAL_BLOCKtitle,
    normalScore: 40,
    advancedScore: 25,
  },
  TWO_BLOCK_MINIMUM: {
    label: language.TWO_BLOCK_MINIMUMtitle,
    normalScore: 20,
    advancedScore: 15,
  },
  EMOJIS: {
    label: `${language.EMOJIStitle}`,
    normalScore: null,
    advancedScore: 12,
  },
  NOT_INCLUDED_ANSWER: {
    label: language.NOT_INCLUDED_ANSWERtitle,
    normalScore: null,
    advancedScore: 10,
  },
  SHORT_TEXT: {
    label: language.SHORT_TEXTtitle,
    normalScore: null,
    advancedScore: 8,
  },
};

const levelOptions = [
  {
    label: `${language.recommendationLevel} 🕹`,
    value: null,
  },
  {
    label: language.normal,
    value: constants.DEPTH_NORMAL,
  },
  {
    label: language.advanced,
    value: constants.DEPTH_ADVANCED,
  },
];

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ConversationEvaluation = (props) => {
  const [open, setOpen] = useState(false);
  const [bigOpen, setBigOpen] = useState(true);

  // Event changes
  const [scoreChange, setScoreChange] = useState(null);
  const [scoreTimeout, setScoreTimeout] = useState(null);
  const [scorePerformance, setScorePerformance] = useState("bad");
  const [collapseScore, setCollapseScore] = useState(false);

  const recommendations = useSelector(
    (state) => state.conversationReducer.recommendations
  );
  const recommendationSummary = useSelector(
    (state) => state.conversationReducer.recommendationSummary
  );

  const dispatch = useDispatch();

  const prevRecommendations = usePrevious(recommendations);

  useEffect(() => {
    let score = calculateScore();
    if (score !== recommendationSummary.score) {
      dispatch({
        type: types.SET_RECOMMENDATION_SCORE,
        value: score,
      });
    }
    if (prevRecommendations) {
      let scoreIndex =
        recommendationSummary.level === constants.DEPTH_NORMAL
          ? "normalScore"
          : "advancedScore";
      Object.keys(prevRecommendations).forEach((recommendation) => {
        let recommendationScore =
          recommendationOptions[recommendation][scoreIndex];
        let prevValue = prevRecommendations[recommendation];
        let newValue = recommendations[recommendation];
        if (prevValue !== newValue && recommendationScore !== null) {
          if (newValue) {
            setScoreChange(recommendationScore);
          } else {
            setScoreChange(-recommendationScore);
          }
          if (scoreTimeout) {
            clearTimeout(scoreTimeout);
            setScoreTimeout(null);
          }
        }
      });
    }
    return () => {
      clearTimeout(scoreTimeout);
    };
  }, [recommendations]);

  useEffect(() => {
    if (scoreChange !== null) {
      setCollapseScore(false);
      setScoreTimeout(
        setTimeout(() => {
          setScoreChange(null);
          clearTimeout(scoreTimeout);
          setScoreTimeout(null);
        }, 2000)
      );
      setTimeout(() => {
        setCollapseScore(true);
      }, 1500);
    }
  }, [scoreChange]);

  useEffect(() => {
    let performance = scoreToPerformance(recommendationSummary.score);
    if (performance !== scorePerformance) {
      setScorePerformance(performance);
    }
    let score = calculateScore();
    if (score !== recommendationSummary.score) {
      dispatch({
        type: types.SET_RECOMMENDATION_SCORE,
        value: score,
      });
    }
  }, [recommendationSummary]);

  const validateAutomaticImprovement = () => {
    let diagramModel = props.diagramEngine.getDiagramModel();
    let nodes = diagramModel.getNodes();

    let hsmGoal = null;
    let emojiCount = 0;
    let emojiQuestion = false;
    let buttonsCount = 0;
    let buttonsQuestion = false;
    let questionCount = 0;

    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];
      const nodeType = node.nodeType;
      if (nodeType === "default-question-hsm") {
        if (hsmGoal === null) {
          hsmGoal = true;
        }
        const currentGoal = node.getGoalMeasurement().targetEvents.length > 0;
        if (currentGoal) {
          hsmGoal = false;
        }
      } else if (
        [
          "default-question-open",
          "default-question-closed",
          "default-question-closed-buttons",
          "default-question-closed-list",
        ].includes(nodeType)
      ) {
        questionCount++;
        const nodeText = node.getText();
        // Check for emojis
        if (checkEmoji(nodeText)) {
          emojiCount++;
        }
        // Check for buttons
        if (
          [
            "default-question-closed-buttons",
            "default-question-closed-list",
          ].includes(nodeType)
        ) {
          buttonsCount++;
        }
      }
    });

    if (questionCount === 0 || buttonsCount < questionCount / 2) {
      buttonsQuestion = true;
    }

    if (questionCount === 0 || emojiCount < questionCount / 2) {
      emojiQuestion = true;
    }

    return [hsmGoal, buttonsQuestion, emojiQuestion];
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const renderOptions = () => {
    const isNormal = recommendationSummary.level === constants.DEPTH_NORMAL;

    let validKeys = Object.keys(recommendationOptions)
      .map((option) => {
        if (!isNormal || recommendationOptions[option].normalScore !== null) {
          return option;
        }
      })
      .filter((option) => option !== undefined)
      .sort((a, b) => {
        const recommendationA = recommendations[a];
        const recommendationB = recommendations[b];
        if (recommendationA && recommendationB) {
          return 0;
        } else if (recommendationA && !recommendationB) {
          return 1;
        } else {
          return -1;
        }
      });

    return validKeys.map((option) => {
      let recommendationOpt = recommendationOptions[option];
      return (
        <RecommendationOption
          key={recommendationOpt.label}
          points={
            isNormal
              ? recommendationOpt.normalScore
              : recommendationOpt.advancedScore
          }
          label={recommendationOpt.label}
          completeStatus={recommendations[option] ? "complete" : "missing"}
          onClick={() => {
            events.track("Click on mission", { Mission: option });
            props.selectModalOption(option);
          }}
        />
      );
    });
  };

  const calculateScore = () => {
    let tmpScore = 0;
    let scoreIndex =
      recommendationSummary.level === constants.DEPTH_ADVANCED
        ? "advancedScore"
        : "normalScore";
    Object.keys(recommendations).forEach((recommendation) => {
      let recommendationScore =
        recommendationOptions[recommendation][scoreIndex];
      if (recommendations[recommendation] && recommendationScore) {
        tmpScore += recommendationScore;
      }
    });
    return tmpScore;
  };

  const scoreToPerformance = () => {
    if (recommendationSummary.score < 60) {
      return "bad";
    } else if (recommendationSummary.score < 99) {
      return "good";
    } else {
      return "perfect";
    }
  };

  const renderComponent = () => {
    const [hsmGoal, buttonQuestion, emojiQuestion] =
      validateAutomaticImprovement();

    if (open) {
      return (
        <Fragment>
          <div className="header">
            <SelectDropdownV2
              options={levelOptions}
              optionHeight={35}
              listHeight={224}
              onSelect={(option) => {
                events.track("Select analysis depth", { Depth: option.value });
                dispatch({
                  type: types.SET_RECOMMENDATION_LEVEL,
                  value: option.value,
                });
              }}
              value={recommendationSummary.level}
              className="level-selector"
              valueKey={true}
              renderOption={(option) => {
                if (option.value === null) {
                  return (
                    <div className="read-only">
                      <p>{option.label}</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="level-option">
                      <p className="prefix">{language.recommendationLevel}:</p>
                      <p>{option.label}</p>
                    </div>
                  );
                }
              }}
            />
            <OverlayTrigger
              placement={"top"}
              overlay={
                <p className="recommendation-tooltip">{language.minimize}</p>
              }
            >
              <button className="close-button" onClick={handleOpen} />
            </OverlayTrigger>
          </div>
          <div className="conversation-quality">
            <p>{language.conversationQuality}</p>
            <OverlayTrigger
              placement={"left"}
              overlay={
                <Tooltip id="conversation-quality">
                  <p>
                    {language.conversationQualityText1}
                    <br />
                    <br />
                    {language.conversationQualityText2}
                  </p>
                </Tooltip>
              }
            >
              <div className="question-icon" />
            </OverlayTrigger>
          </div>
          <div className="recommendation-header">
            <div className="score-container">
              <div className={`evaluation-icon ${scorePerformance}`} />
              <div className="score">
                <p>{recommendationSummary.score}</p>
                <p>{language.score}</p>
              </div>
            </div>
            {recommendationSummary.score < 100 && (
              <div>
                <button
                  onClick={() => {
                    events.track("Click on automatic improvement");
                    props.selectModalOption("automaticImprovement", [
                      hsmGoal,
                      buttonQuestion,
                      emojiQuestion,
                    ]);
                  }}
                  disabled={!hsmGoal && !buttonQuestion & !emojiQuestion}
                >
                  {language.automaticImprovement}
                </button>
              </div>
            )}
            {recommendationSummary.score === 100 && (
              <div className="fire-score">
                <p>🔥🔥🔥🔥🔥</p>
              </div>
            )}
          </div>
          <div className="compliance-bar">
            <div className="ratio">
              <p>{recommendationSummary.score}/100</p>
            </div>
            <div className="bar">
              <div
                className="bar-progress"
                style={{ width: `${recommendationSummary.score}%` }}
              />
            </div>
          </div>
          <div className="recommendation-option-container">
            {renderOptions()}
          </div>
          <div
            className="tips-CTA"
            onClick={() => {
              events.track("Click on tips");
              props.selectModalOption("tips");
            }}
          >
            <p>{language.knowMoreTips}</p>
          </div>
        </Fragment>
      );
    }
    return (
      <div
        className={`evaluation-icon-container-dinamic ${
          scoreChange !== null ? "transition-wobble" : ""
        }`}
        onClick={() => {
          events.track("Click on drag and drop helper");
          handleOpen();
        }}
      >
        <div className="evaluation-icon-container">
          {scoreChange !== null && (
            <div
              className={`evaluation-icon ${
                scoreChange > 0 ? "mission-done" : "mission-undone"
              }`}
            />
          )}
        </div>
        <div className="evaluation-icon-container">
          <div className={`evaluation-icon ${scoreToPerformance()}`} />
        </div>
      </div>
    );
  };

  const renderHelper = () => {
    let diagramModel = props.diagramEngine.getDiagramModel();
    let nodes = diagramModel.getNodes();

    if (Object.keys(nodes).length > 100) {
      return (
        <div
          className={`big-conversation-evaluation ${
            bigOpen ? "display" : "hidden"
          }`}
        >
          <div
            className="icon icon--close-mask"
            onClick={() => setBigOpen(false)}
          />
          <p>{language.evaluationTooBig}</p>
        </div>
      );
    } else {
      return (
        <div
          className={`conversation-evaluation-container ${
            open ? "open" : "close"
          } ${
            recommendationSummary.level === constants.DEPTH_ADVANCED
              ? "full-options"
              : ""
          }`}
        >
          {renderComponent()}
        </div>
      );
    }
  };

  return (
    <>
      {!open && (
        <div
          className={`score-change-container ${
            scoreChange > 0 ? "positive" : "negative"
          } ${scoreChange === null ? "hidden" : ""} ${
            collapseScore ? "collapse-transition" : ""
          }`}
        >
          {scoreChange > 0 ? (
            <p className="score-change">
              +{scoreChange} {language.score} 🔥
            </p>
          ) : (
            <p className="score-change">
              {scoreChange} {language.score} 😢
            </p>
          )}
        </div>
      )}
      {renderHelper()}
    </>
  );
};

export default ConversationEvaluation;
