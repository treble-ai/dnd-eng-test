import { combineReducers } from "redux";
import mainReducer from "./duck/";
import conversationReducer from "./views/Conversation/duck/";

const rootReducer = combineReducers({
  mainReducer,
  conversationReducer,
});

export default rootReducer;
