import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";

import "./SimpleSelectDropdown.scss";

class SimpleSelectDropdown extends Component {
  /**
   *
   * @param {*} props
   * value: string
   * placeholder: string
   * options: list [{ label: ... , value: .... }]
   * onSelect: function
   * checkIcon: string icon
   * ----optional----
   * class
   * renderOption
   * hideOnSelect: boolean
   * hideOnClick: boolean
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      optionSelected: this.props.value,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ optionSelected: this.props.value });
    }
  }
  handleClickOutside = (event) => {
    if (!this.props.hideOnClick) this.setState({ open: false });
  };
  onSelect = (option) => {
    this.props.onSelect(option);
    if (!this.props.hideOnSelect) this.setState({ open: false });
  };
  renderOption = (option) => {
    if (this.props.renderOption) return this.props.renderOption(option);
    const isSelected = option.label === this.state.optionSelected;
    return (
      <div
        className={`option ${isSelected ? "is-select" : ""}`}
        key={option.value}
        onClick={() => this.onSelect(option)}
      >
        <p>{option.label}</p>
        {isSelected && (
          <div
            className={`icon icon--${
              this.props.checkIcon ? this.props.checkIcon : "check-white"
            }`}
          ></div>
        )}
      </div>
    );
  };
  render() {
    return (
      <div className={`simple-select-dropdown ${this.props.class}`}>
        <div
          className={`trigger ${this.state.open ? "is-open" : ""}`}
          onClick={() => this.setState({ open: true })}
        >
          <p>
            {this.state.optionSelected
              ? this.state.optionSelected
              : this.props.placeholder}
          </p>
          <div className="icon icon--dropdown-arrow-2"></div>
        </div>
        {this.state.open && (
          <div className="options">
            {this.props.options.map((option) => this.renderOption(option))}
          </div>
        )}
      </div>
    );
  }
}

export default onClickOutside(SimpleSelectDropdown);
