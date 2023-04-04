import { connect } from "react-redux";
import { DiagramWidgetComponent } from "./DiagramWidgetComponent";

import { operations } from "views/Conversation/duck";

const mapStateToProps = (state) => {
  const { mainReducer, conversationReducer } = state;
  return {
    diagramScrollingEnabled: mainReducer.diagramScrollingEnabled,
    selectedNode: conversationReducer.selectedNode,
    recommendations: conversationReducer.recommendations,
  };
};

const mapDispatchToProps = (dispatch) => {
  const selectNode = (node) => {
    dispatch(operations.changeNodeSelected(node));
  };

  const setCompleteRecommendation = (recommendation, value) => {
    dispatch(operations.setCompleteRecommendation(recommendation, value));
  };

  return {
    selectNode,
    setCompleteRecommendation,
  };
};

export const DiagramWidget = connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(DiagramWidgetComponent);
