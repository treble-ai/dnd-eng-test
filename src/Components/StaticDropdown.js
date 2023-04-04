import React, { Component } from "react";
import "./StaticDropdown.scss";
/*
	props:
	- onSelect function([obj]): to be called when an option is clicked, it calls all the clicked objects
*/
export class StaticDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  render = () => {
    let onSelect = this.props.onSelect;

    if (typeof onSelect !== "function") onSelect = () => {};
    return (
      <div className="static-dropdown">
        <div
          className={`trigger-component ${this.state.open ? "is-active" : ""}`}
        >
          <div onClick={() => this.setState({ open: !this.state.open })}>
            {this.props.triggerComponent}
          </div>
        </div>
        <div
          className={`static-menu ${this.state.open ? "is-active" : ""}`}
          role="menu"
        >
          <div className="static-content">{this.props.children}</div>
        </div>
      </div>
    );
  };
}

export default StaticDropdown;
