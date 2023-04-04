import { connect } from "react-redux";
import { QuestionOpenNodeWidget } from "./QuestionOpenNodeWidget";

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

const QuestionOpenNodeContainer = connect(
  mapStateToProps,
  matDispatchToProps,
  null,
  {
    areOwnPropsEqual: myAreOwnPropsEqual,
  }
)(QuestionOpenNodeWidget);

export default QuestionOpenNodeContainer;
