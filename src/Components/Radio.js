import React from "react";

import "./Radio.scss";

/*
  props:
    - item obj: object with name and value of the radio
    - onChange function([obj]): to be called when something is written in the input
    - checked bool: boolean if it is checked or not
*/

const Radio = (props) => {
  let onChange = props.onChange;

  if (typeof onChange !== "function") onChange = () => {};

  return (
    <div className="custom-radio" key={props.key}>
      <input
        type="radio"
        value={props.item.value}
        onChange={props.onChange}
        id={`radio-${props.item.name}`}
        checked={props.checked}
        className="custom-control-input"
        key={`input-${props.key}`}
      />

      <label
        className="custom-control-label"
        key={`label-${props.key}`}
        htmlFor={`radio-${props.item.name}`}
      >
        <p className="r">{props.item.name}</p>
      </label>
    </div>
  );
};

export default Radio;
