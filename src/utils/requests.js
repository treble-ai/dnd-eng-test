import $ from "jquery";
import { stringify } from "query-string";

const URL = process.env.REACT_APP_API_TREBLE_AI;
const URL_SLS = process.env.REACT_APP_MAIN_TREBLE_AI;

export default {
  login: (username, password, cb_success, cb_error) => {
    $.ajax({
      method: "POST",
      url: URL_SLS + "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      xhrFields: { withCredentials: false },
      data: JSON.stringify({ username, password }),
      success: (data) => {
        cb_success(data);
      },
      error: (data) => {
        data.mustAuthenticate = false;
        if (
          data &&
          data.responseJSON &&
          "msg" in data.responseJSON &&
          (data.responseJSON["msg"] == "Signature verification failed" ||
            data.responseJSON["msg"] ==
              "Bad Authorization header. Expected value 'Bearer <JWT>'")
        ) {
          data.mustAuthenticate = true;
          // localStorage.clear();
          // window.location.href = '/login';
        }
        cb_error(data);
      },
    });
  },

  upload: (method, url, data, cb_success, cb_error) => {
    let token = this.a.token();

    $.ajax({
      url: URL + url,
      data: data,
      type: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      // ... Other options like success and etc
      success: (data) => {
        cb_success(data);
      },
      error: (data) => {
        cb_error(data);
      },
    });
  },
  token: () => {
    let token = localStorage["token"];

    if (token === undefined) return null;
    else return token;
  },
  save_token: (token) => {
    // let user_str = JSON.stringify(user_data);
    localStorage["token"] = token;
  },
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
  url: URL,
};
