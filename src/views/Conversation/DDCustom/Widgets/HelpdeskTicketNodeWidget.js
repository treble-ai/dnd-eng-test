import { connect } from "react-redux";
import HelpdeskTicketNodeComponent from "./HelpdeskTicketNodeComponent";

import { operations } from "../../duck";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    helpdeskProperties: conversationReducer.helpdeskProperties?.tickets,
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

const HelpdeskTicketNodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { areOwnPropsEqual: myAreOwnPropsEqual }
)(HelpdeskTicketNodeComponent);

export default HelpdeskTicketNodeContainer;
