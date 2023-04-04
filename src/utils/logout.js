import events from "utils/events";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("me");
  events.reset();
  window.location.href = "/login";
};
