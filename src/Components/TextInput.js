import React from "react";
import withTrackOnChange from "./withTrackOnChange";

import "./TextInput.scss";

/*
	props:
		- placeholder str: text to be displayed when empty
		- type str: type of input text (e.g text, email, password, tel)
    - onChange function([obj]): to be called when something is written in the input
    - value str: value to be written
    - trackMessage str: event name to be sent to events.track
    - trackData obj: extra data to add to events.track (text value is always tracked)
    - Any other
*/

const renderClearCrossButton = (props) => {
  if (!props.clearButtonOption) return;
  return (
    <button
      className="input-clear-button"
      onClick={(e) => props.handleClearClick(e)}
    />
  );
};

const TextInput = (props) => {
  return (
    <>
      <input {...props} />
      {renderClearCrossButton(props)}
    </>
  );
};

export default withTrackOnChange(TextInput);
