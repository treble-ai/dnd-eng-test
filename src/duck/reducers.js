import types from "./types";

const INITIAL_STATE = {
  onLoading: false,
  diagramScrollingEnabled: true,
};

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ON_LOADING: {
      const { value } = action;
      return {
        ...state,
        onLoading: value,
      };
    }
    case types.DISABLE_DIAGRAM_SCROLL: {
      return {
        ...state,
        diagramScrollingEnabled: false,
      };
    }
    case types.ENABLE_DIAGRAM_SCROLL: {
      return {
        ...state,
        diagramScrollingEnabled: true,
      };
    }
    default:
      return state;
  }
};

export default mainReducer;
