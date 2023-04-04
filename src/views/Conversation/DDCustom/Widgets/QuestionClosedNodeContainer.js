import { connect } from "react-redux";
import { QuestionClosedNodeWidget } from "./QuestionClosedNodeWidget";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    helpdeskProperties: conversationReducer.helpdeskProperties,
    selectedNode: conversationReducer.selectedNode,
    hasHubspotIntegration: conversationReducer.hasHubspotIntegration,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const myAreOwnPropsEqual = (next, prev) => {
  return false;
};

const QuestionClosedNodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areOwnPropsEqual: myAreOwnPropsEqual,
  }
)(QuestionClosedNodeWidget);

export default QuestionClosedNodeContainer;
