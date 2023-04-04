import types from "./types.js";
import { store } from "index";

const setOnLoading = (value) => ({
  type: types.SET_ON_LOADING,
  value: value,
});

const disableDiagramScrollAction = () => ({
  type: types.DISABLE_DIAGRAM_SCROLL,
});

const enableDiagramScrollAction = () => ({
  type: types.ENABLE_DIAGRAM_SCROLL,
});

export function sendMessage(name, data) {
  return {
    event: name,
    emit: true,
    payload: data,
  };
}

export { setOnLoading, disableDiagramScrollAction, enableDiagramScrollAction };
