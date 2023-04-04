import React from "react";

import "./NewComponentPill.scss";

const NewComponentPill = (props) => {
  return (
    <div className={`new-component pill ${props.color}`}>{props.label}</div>
  );
};

export default NewComponentPill;
