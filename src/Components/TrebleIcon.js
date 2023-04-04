import React, { Component } from "react";

import "./TrebleIcon.scss";

const TrebleIcon = (props) => {
  const cursor = props.cursor ? `cursor-${props.cursor}` : "";

  var src = require(`assets/icons/${props.name}.svg`);
  return (
    <img
      src={src}
      {...props}
      className={`treble-icon size-${props.size} ${cursor}`}
    />
  );
};

export default TrebleIcon;
