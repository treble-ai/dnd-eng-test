import { connect } from "react-redux";
import { QuestionClosedButtonsNodeWidget } from "./QuestionClosedButtonsNodeWidget";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    helpdeskProperties: conversationReducer.helpdeskProperties,
    selectedNode: conversationReducer.selectedNode,
    hasHubspotIntegration: conversationReducer.hasHubspotIntegration,
  };
};

const matDispatchToProps = (dispatch) => {
  return {};
};

const myAreOwnPropsEqual = (next, prev) => {
  return false;
};

const QuestionClosedButtonsNodeContainer = connect(
  mapStateToProps,
  matDispatchToProps,
  null,
  { areOwnPropsEqual: myAreOwnPropsEqual }
)(QuestionClosedButtonsNodeWidget);

export default QuestionClosedButtonsNodeContainer;
