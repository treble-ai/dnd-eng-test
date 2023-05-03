import React, { useEffect, useState } from "react";

import "./SetHsmInNode.scss";

import events from "utils/events";
import HsmCreationModal from "../Modals/HsmCreationModal";

const SetHsmInNode = (props) => {
  const [state, setState] = useState({
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

  const renderComponent = () => {
    let me = { id: 0, user_id: 0 };
    const { configured } = state;

    if (!configured) {
      return (
        <div
          className="hsm-icon"
          onClick={() => {
            events.track("click on HSM x2", {
              company_id: me.id,
              user_id: me.user_id,
            });
            setState({
              ...state,
              showModal: true,
            });
          }}
        ></div>
      );
    }else{
      return null;
    }
  };
  const renderCreateTargetModal = () => {
    return (
      <HsmCreationModal
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
    <div className="hsm-selector-block">
      {renderComponent()}
      {renderCreateTargetModal()}
    </div>
  );
};

export default SetHsmInNode;
