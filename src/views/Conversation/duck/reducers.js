import types from "./types";
import constants from "assets/constants.js";

const INITIAL_STATE = {
  polls: [],
  hsmList: [],
  agentTags: [],
  conversation: null,
  selectedNode: null,
  helpdeskIntegrations: [],
  helpdeskProperties: {},
  googleSheetCode: null,
  hasHubspotIntegration: false,
  loading: false,
  userReports: [],
  recommendations: {
    BUTTONS_BLOCK: false,
    GOAL_BLOCK: false,
    TWO_BLOCK_MINIMUM: false,
    EMOJIS: false,
    NOT_INCLUDED_ANSWER: false,
    SHORT_TEXT: false,
  },
  recommendationSummary: {
    level: constants.DEPTH_NORMAL,
    score: 0,
  },
  visualization: "draft",
};

const conversationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.RECEIVE_HSM_LIST: {
      const { value } = action;
      return {
        ...state,
        hsmList: value,
      };
    }

    case types.RECEIVE_POLLS: {
      const { value } = action;
      return {
        ...state,
        polls: value,
      };
    }

    case types.SET_CONVERSATION_NAME: {
      const { value } = action;
      return {
        ...state,
        conversation: {
          ...state.conversation,
          name: value,
        },
      };
    }

    case types.RECEIVE_AGENT_TAGS: {
      const { value } = action;
      return {
        ...state,
        agentTags: value,
      };
    }

    case types.RECEIVE_HELPDESK_INTEGRATIONS: {
      const { value } = action;
      return {
        ...state,
        helpdeskIntegrations: value,
      };
    }

    case types.RECEIVE_HUBSPOT_PROPERTIES: {
      const { value } = action;
      return {
        ...state,
        helpdeskProperties: value,
      };
    }

    case types.RECEIVE_CONVERSATION: {
      const { value } = action;
      return {
        ...state,
        conversation: {
          ...value,
        },
      };
    }

    case types.RECEIVE_NODE_SELECTION: {
      const { value } = action;
      return {
        ...state,
        selectedNode: value,
      };
    }
    case types.RECEIVE_GOOGLE_SHEET_CODE: {
      const { value } = action;
      return {
        ...state,
        googleSheetCode: value,
      };
    }

    case types.SET_HAS_HUBSPOT_INTEGRATION: {
      const { value } = action;
      return {
        ...state,
        hasHubspotIntegration: value,
      };
    }

    case types.SET_COMPLETE_RECOMMENDATION_ACTION: {
      const { value, recommendation } = action.payload;

      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [recommendation]: value,
        },
      };
    }

    case types.SET_RECOMMENDATION_LEVEL: {
      const { value } = action;

      return {
        ...state,
        recommendationSummary: {
          ...state.recommendationSummary,
          level: value,
        },
      };
    }

    case types.SET_RECOMMENDATION_SCORE: {
      const { value } = action;
      return {
        ...state,
        recommendationSummary: {
          ...state.recommendationSummary,
          score: value,
        },
      };
    }
    case types.SET_POLL_VISUALIZATION: {
      const { value } = action;
      return {
        ...state,
        visualization: value
      };
    }

    default:
      return state;
  }
};

export default conversationReducer;
