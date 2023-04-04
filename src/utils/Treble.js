import $ from "jquery";
import requests from "./requests";

let treble = {
  deploy: (data, success_cb, error_cb) => {
    if (!("user_session_keys" in data)) data["user_session_keys"] = [];
    let body = JSON.stringify({
      users: [
        {
          cellphone: data.cellphone,
          country_code: data.country_code,
          user_session_keys: data.user_session_keys,
        },
      ],
    });

    $.ajax({
      url: requests.url + `/api/poll/${data.poll_id}/deploy`,
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "yW4Acq9GFz6Y1t9EwL56nGisiWgNZq6ITZM5jtgUe52RvEJgwBuNO6n9JEC3HqdZ6J6",
      },
      data: body,
      success: (data) => {
        if (success_cb instanceof Function) success_cb();
        this.setState({ demoDeployed: true, demoDeploying: false });
      },
      error: (data) => {
        error_cb();
        alert("Por favor intenta de nuevo");
        this.setState({ demoDeploying: false });
      },
    });
  },
};

export default treble;
