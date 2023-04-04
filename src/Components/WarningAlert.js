import React from "react";
import { Alert } from "react-bootstrap";
import alert_icon from "assets/images/alert.svg";

import "./WarningAlert.scss";

/*
	props:
    - text str: text to be displayed as warning
    - key_id str: key prop
    - classes str: extra classNames
*/

const WarningAlert = (props) => {
  return (
    <Alert className={`warning-alert ${props.classes}`}>
      <img
        src={alert_icon}
        alt="triangle with exclamation"
        className="danger-icon"
      />
      {props.text}
    </Alert>
  );
};

export default WarningAlert;
