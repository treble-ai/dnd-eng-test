import events from "utils/events";

export const sendMixpanelError = (view, request, error) => {
  events.track(view, {
    request,
    error,
  });
};
