import {
  setOnLoading,
  disableDiagramScrollAction,
  enableDiagramScrollAction,
} from "./actions";

const getLoading = () => {
  return (dispatch) => {
    dispatch(setOnLoading(true));
    dispatch(setOnLoading(false));
  };
};

const disableDiagramScroll = () => {
  return (dispatch) => {
    dispatch(disableDiagramScrollAction());
  };
};

const enableDiagramScroll = () => {
  return (dispatch) => {
    dispatch(enableDiagramScrollAction());
  };
};

export default {
  getLoading,
  disableDiagramScroll,
  enableDiagramScroll,
};
