import types from "./types.js";

const setConversationName = (value) => ({
  type: types.SET_CONVERSATION_NAME,
  value: value,
});

const receiveHSMList = (value) => ({
  type: types.RECEIVE_HSM_LIST,
  value,
});

const receiveAgentTags = (value) => ({
  type: types.RECEIVE_AGENT_TAGS,
  value,
});

const receivePolls = (value) => ({
  type: types.RECEIVE_POLLS,
  value,
});

const receiveHelpdeskIntegrations = (value) => ({
  type: types.RECEIVE_HELPDESK_INTEGRATIONS,
  value,
});

const receiveHubspotProperties = (value) => ({
  type: types.RECEIVE_HUBSPOT_PROPERTIES,
  value,
});

const receiveConversation = (value) => ({
  type: types.RECEIVE_CONVERSATION,
  value,
});

const setPollVisualization = (value) => ({
  type: types.SET_POLL_VISUALIZATION,
  value,
});

const receiveNodeSelection = (value) => ({
  type: types.RECEIVE_NODE_SELECTION,
  value,
});

const receiveValidGoogleSheetFormat = (value) => ({
  type: types.RECEIVE_GOOGLE_SHEET_CODE,
  value,
});

const setHasHubspotIntegrationAction = (value) => ({
  /**
   * @param {boolean} value
   */
  type: types.SET_HAS_HUBSPOT_INTEGRATION,
  value,
});

const setCompleteRecommendationAction = (recommendation, value) => ({
  type: types.SET_COMPLETE_RECOMMENDATION_ACTION,
  payload: {
    recommendation,
    value,
  },
});

export {
  setConversationName,
  receiveHSMList,
  receiveAgentTags,
  receivePolls,
  receiveHelpdeskIntegrations,
  receiveHubspotProperties,
  receiveConversation,
  receiveNodeSelection,
  receiveValidGoogleSheetFormat,
  setHasHubspotIntegrationAction,
  setCompleteRecommendationAction,
  setPollVisualization
};
