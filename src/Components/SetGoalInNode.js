import React, { useEffect, useState } from "react";
import CreateTargetEventModal from "./Modals/CreateTargetEventModal";

import "./SetGoalInNode.scss";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";
import events from "utils/events";
const language = languages[getLanguage()];

const SetGoalInNode = (props) => {
  const [state, setState] = useState({
    open: false,
    configured: false,
    showModal: false,
  });

  useEffect(() => {
    setState({
      ...state,
      configured: !!props.node.getGoalMeasurement().targetEvents.length,
      showModal:
        props.node.hsm &&
        props.node.hasButtonLink() &&
        props.node.goalMeasurement.campaignGoal === "",
    });
  }, [props.node.getGoalMeasurement().targetEvents.length]);

  const deleteGoalMeasurement = () => {
    props.node.updateGoalMeasurement({
      campaignGoal: "",
      targetEvents: [],
    });

    setState({
      ...state,
      configured: false,
    });
    props.forceUpdate();
  };

  const renderComponent = () => {
    let me = { id: 0, user_id: 0 };
    const { open, configured } = state;

    if (!open && !configured) {
      return <div className="goal-icon"></div>;
    }
    if (!open && configured) {
      return <div className="gold-goal-icon"></div>;
    }
    if (open) {
      if (configured) {
        return (
          <div className="setting-goal">
            <div>
              {!props.node.hsm || !props.node.hasButtonLink() ? (
                <>
                  <p onClick={deleteGoalMeasurement}>{language.delete}</p>
                  <p>|</p>
                </>
              ) : null}
              <p
                onClick={() => {
                  setState({
                    ...state,
                    showModal: true,
                  });
                }}
              >
                {language.edit}
              </p>
            </div>
            <div className="gold-goal-icon"></div>
          </div>
        );
      } else {
        return (
          <div
            className="setting-goal"
            onClick={() => {
              events.track("click on set goal on block", {
                company_id: me.id,
                user_id: me.user_id,
              });
              setState({
                ...state,
                showModal: true,
              });
            }}
          >
            <div>
              <p>{language.goalBlock}</p>
            </div>
            <div className="gold-goal-icon"></div>
          </div>
        );
      }
    }
  };
  const renderCreateTargetModal = () => {
    return (
      <CreateTargetEventModal
        show={state.showModal}
        closeModal={() => setState({ ...state, showModal: false })}
        configured={state.configured}
        setConfigured={() =>
          setState({ ...state, configured: true, showModal: false })
        }
        node={props.node}
        forceUpdate={props.forceUpdate}
        diagramEngine={props.diagramEngine}
      />
    );
  };

  return (
    <div
      className="goal-selector-block"
      onMouseEnter={() => setState({ ...state, open: true })}
      onMouseLeave={() => setState({ ...state, open: false })}
    >
      {renderComponent()}
      {renderCreateTargetModal()}
    </div>
  );
};

export default SetGoalInNode;
