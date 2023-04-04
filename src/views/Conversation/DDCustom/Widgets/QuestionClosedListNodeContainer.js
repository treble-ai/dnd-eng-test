import { connect } from "react-redux";
import { QuestionClosedListNodeWidget } from "./QuestionClosedListNodeWidget";

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

const QuestionClosedListNodeContainer = connect(
  mapStateToProps,
  matDispatchToProps,
  null,
  {
    areOwnPropsEqual: myAreOwnPropsEqual,
  }
)(QuestionClosedListNodeWidget);

export default QuestionClosedListNodeContainer;
