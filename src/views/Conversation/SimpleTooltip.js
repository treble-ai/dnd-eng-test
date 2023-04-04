import React, { Component } from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

/*
	props:
		- message str: message to be display
		- itemtohover obj: html object with item selected to have tooltip. Example:
		- buttons, i, span, etc
		- placement str: placement of tooltip
		- NOTE: if the item has funcionality use the following optional props:
			- onClick function(obj)
			- buttonText str: text to be display on button
*/

const SimpleTooltip = (props) => {
  const renderTooltip = () => {
    return (
      <Tooltip className="simple-tooltip">
        <div className="all-text-container">
          <div className="text-container">
            <p className="r">{props.message}</p>
          </div>
        </div>
      </Tooltip>
    );
  };
  const handleHoverItem = () => {
    if (props.itemtohover.type == "i") {
      return <i className={`${props.itemtohover.props["className"]}`} />;
    } else if (props.itemtohover.type == "button") {
      return (
        <button
          className={`${props.itemtohover.props["className"]}`}
          onClick={typeof props.onClick === "function" ? props.onClick : null}
        >
          {props.buttonText}
        </button>
      );
    } else if (props.itemtohover.type == "div") {
      return (
        <div
          className={`${props.itemtohover.props["className"]}`}
          data-name={
            props.itemtohover.props["data-name"]
              ? `${props.itemtohover.props["data-name"]}`
              : null
          }
          data-nodeid={
            props.itemtohover.props["data-nodeid"]
              ? `${props.itemtohover.props["data-nodeid"]}`
              : null
          }
        />
      );
    } else if (props.itemtohover.type == "span") {
      return (
        <span
          className={`${props.itemtohover.props["className"]}`}
          onClick={typeof props.onClick === "function" ? props.onClick : null}
          onMouseEnter={props.itemtohover.props.onMouseEnter}
          onMouseLeave={props.itemtohover.props.onMouseLeave}
        ></span>
      );
    }
  };

  const constructTooltip = () => {
    return (
      <OverlayTrigger
        placement={props.placement}
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip()}
      >
        {handleHoverItem()}
      </OverlayTrigger>
    );
  };

  return <div>{constructTooltip()}</div>;
};

export default SimpleTooltip;
