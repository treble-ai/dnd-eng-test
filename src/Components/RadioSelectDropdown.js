import React, { Component } from "react";

import "./RadioSelectDropdown.scss";

/*
	props:
		- options list(obj): options to be displayed
		- noSelectionTitle str: text to be displayed when empty
		- display function(obj) -> str: a map between an object an its display
		- onSelect function([obj]): to be called when an option is clicked, it calls all the clicked objects
		- selectedOption (obj): selected option
*/

class RadioSelectDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedOption:
        this.props.selectedOption !== undefined
          ? this.props.selectedOption
          : null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedOption !== prevProps.selectedOption) {
      this.setState({ selectedOption: this.props.selectedOption });
    }
  }

  onSelect = (option) => {
    let onSelectFunc = this.props.onSelect;
    if (typeof this.props.onSelect !== "function") {
      onSelectFunc = () => {};
    }
    if (option !== this.state.selectedOption) {
      onSelectFunc(option);
    }
  };

  selectOption = (option) => {
    this.onSelect(option);
  };

  displayTitle = () => {
    const { selectedOption } = this.state;

    if (selectedOption === null && this.props.titleDisplay) {
      return this.props.titleDisplay(selectedOption);
    } else if (selectedOption !== null) {
      let propOption = this.props.options.filter((opt) => {
        let value = opt;
        if (this.props.valueProperty) {
          value = opt[this.props.valueProperty];
        }
        return value === selectedOption;
      });
      if (propOption) {
        return this.props.display(propOption[0]);
      }
    }

    return this.props.noSelectionTitle;
  };

  renderDropdownIcon = () => {
    if (this.props.dropdownIcon) {
      return (
        <div
          className={`icon icon--${this.props.dropdownIcon} icon-dropdown`}
        />
      );
    }
    return (
      <span className="icon is-small">
        <i className="fa fa-caret-down" aria-hidden="true"></i>
      </span>
    );
  };

  renderRadio = (active) => {
    return (
      <div className={`icon icon--radio-${active === true ? "on" : "off"}`} />
    );
  };

  renderSelectAll = () => {
    return (
      <div
        className="select-all"
        onClick={() => {
          if (this.state.selectedOption !== null) {
            this.selectOption(null);
          }
        }}
      >
        <p>{this.props.noSelectionTitle}</p>
        <div
          className={`icon icon--radio-${
            this.state.selectedOption === null ? "on" : "off"
          }`}
        />
      </div>
    );
  };

  render = () => {
    return (
      <div
        className={`dropdown ${
          this.state.open ? "is-active" : ""
        } radio-select-dropdown`}
      >
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <div className="title">
              <p>{this.displayTitle()}</p>
            </div>

            {this.renderDropdownIcon()}
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {this.props.selectAll && this.renderSelectAll()}
            {this.props.options.map((e) => {
              let option = this.props.valueProperty
                ? e[this.props.valueProperty]
                : e;
              return (
                <div
                  key={this.props.valueProperty ? option : e}
                  className="dropdown-item"
                  onClick={() => this.selectOption(option)}
                >
                  <p>{this.props.display(e)}</p>
                  {this.renderRadio(this.state.selectedOption === option)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}

export default RadioSelectDropdown;
