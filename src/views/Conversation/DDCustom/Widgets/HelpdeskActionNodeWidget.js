import { connect } from "react-redux";
import HelpdeskActionNodeComponent from "./HelpdeskActionNodeComponent";

import { operations } from "../../duck";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    helpdeskProperties: conversationReducer.helpdeskProperties,
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

const HelpdeskActionNodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { areOwnPropsEqual: myAreOwnPropsEqual }
)(HelpdeskActionNodeComponent);

export default HelpdeskActionNodeContainer;
