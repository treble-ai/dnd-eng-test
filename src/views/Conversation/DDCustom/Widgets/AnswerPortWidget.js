import { connect } from "react-redux";
import AnswerPortComponent from "./AnswerPortComponent";

// This will make sense to you once we discuss the Redux code,
// but for now, just know that 'homeOperations' will let you trigger
// Redux actions

import { operations } from "../../duck";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    hsmList: conversationReducer.hsmList,
    agentTags: conversationReducer.agentTags,
    conversation: conversationReducer.conversation,
    selectedNode: conversationReducer.selectedNode,
  };
};

const mapDispatchToProps = (dispatch) => {
  const selectNode = (node) => {
    dispatch(operations.changeNodeSelected(node));
  };

  return {
    selectNode,
  };
};

const myAreOwnPropsEqual = (next, prev) => {
  return false;
};

const AnswerPortContainer = connect(mapStateToProps, mapDispatchToProps, null, {
  areOwnPropsEqual: myAreOwnPropsEqual,
})(AnswerPortComponent);

export default AnswerPortContainer;
