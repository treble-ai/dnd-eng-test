import { connect } from "react-redux";
import CreateConversationComponent from "./CreateConversationComponent";

// This will make sense to you once we discuss the Redux code,
// but for now, just know that 'homeOperations' will let you trigger
// Redux actions.

import { operations } from "./duck";

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    polls: conversationReducer.polls,
    hsmList: conversationReducer.hsmList,
    agentTags: conversationReducer.agentTags,
    conversation: conversationReducer.conversation,
    selectedNode: conversationReducer.selectedNode,
    helpdeskIntegrations: conversationReducer.helpdeskIntegrations,
    sheetCode: conversationReducer.googleSheetCode,
    conversationLanguage: conversationReducer.conversationLanguage,
    hasHubspotIntegration: conversationReducer.hasHubspotIntegration,
    recommendations: conversationReducer.recommendations,
    recommendationSummary: conversationReducer.recommendationSummary,
    visualization: conversationReducer.visualization,
  };
};

const mapDispatchToProps = (dispatch) => {
  const fetchHSMList = () => {
    dispatch(operations.fetchHSMList());
  };

  const fetchAgentTags = () => {
    dispatch(operations.fetchAgentTags());
  };

  const fetchPolls = () => {
    dispatch(operations.fetchPolls());
  };

  const fetchHelpdeskIntegrations = (errorCallback) => {
    dispatch(operations.fetchHelpdeskIntegrations(errorCallback));
  };

  const fetchTwilioMessageContent = (contentSid, callbackSuccess) => {
    dispatch(operations.fetchTwilioMessageContent(contentSid, callbackSuccess));
  };

  const getConversation = (
    conversationId,
    diagramEngine,
    fixOldSerialization
  ) => {
    dispatch(
      operations.fetchConversation(
        conversationId,
        diagramEngine,
        fixOldSerialization
      )
    );
  };

  const saveConversation = (
    conversationId,
    saveAsCopy,
    apiSchema,
    serializedModel,
    conversationName,
    conversationLanguage,
    settings
  ) => {
    dispatch(
      operations.saveConversation(
        conversationId,
        saveAsCopy,
        apiSchema,
        serializedModel,
        conversationName,
        conversationLanguage,
        settings
      )
    );
  };

  const createConversation = (
    name,
    questionsText,
    apiSchema,
    deploymentMode,
    serializedModel,
    category,
    labelId,
    settings,
    goal
  ) => {
    dispatch(
      operations.createConversation(
        name,
        questionsText,
        apiSchema,
        deploymentMode,
        serializedModel,
        category,
        labelId,
        settings,
        goal
      )
    );
  };

  const createHubSpotIntegration = (
    hubspotCompanyId,
    hubspotAdminEmail,
    hubspotPhoneProperty,
    successCallback
  ) => {
    dispatch(
      operations.createHubSpotIntegration(
        hubspotCompanyId,
        hubspotAdminEmail,
        hubspotPhoneProperty,
        successCallback
      )
    );
  };

  const createZendeskIntegration = (host, successCallback) => {
    dispatch(operations.createZendeskIntegration(host, successCallback));
  };
  const fetchHelpdeskProperties = (helpdesks, errorCallback) => {
    dispatch(operations.fetchHelpdeskProperties(helpdesks, errorCallback));
  };

  const createHelpdeskIntegration = (
    host,
    apiKey,
    integrationType,
    successCallback
  ) => {
    dispatch(
      operations.createHelpdeskIntegration(
        host,
        apiKey,
        integrationType,
        successCallback
      )
    );
  };

  const selectNode = (node) => {
    dispatch(operations.changeNodeSelected(node));
  };

  const setHasHubspotIntegration = (value) => {
    dispatch(operations.setHasHubspotIntegration(value));
  };
  const changePollVisualization = (
    type,
    diagramEngine,
    fixOldSerialization,
    poll,
    onChange,
    callback
  ) => {
    dispatch(
      operations.changePollVisualization(
        type,
        diagramEngine,
        fixOldSerialization,
        poll,
        onChange,
        callback
      )
    );
  };
  const saveConversationDraft = (pollId, model, callback) => {
    dispatch(operations.saveConversationDraft(pollId, model, callback));
  };

  return {
    fetchHSMList,
    fetchAgentTags,
    fetchPolls,
    fetchHelpdeskIntegrations,
    fetchTwilioMessageContent,
    getConversation,
    saveConversation,
    createConversation,
    createHubSpotIntegration,
    createZendeskIntegration,
    createHelpdeskIntegration,
    selectNode,
    setHasHubspotIntegration,
    fetchHelpdeskProperties,
    changePollVisualization,
    saveConversationDraft,
  };
};

const createConversationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateConversationComponent);

export default createConversationContainer;
