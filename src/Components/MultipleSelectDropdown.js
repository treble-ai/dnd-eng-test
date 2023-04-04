import React, { Component } from "react";

import "./MultipleSelectDropdown.scss";

/*
	props:
		- options list(obj): options to be displayed
		- noSelectionTitle str: text to be displayed when empty
		- display function(obj) -> str: a map between an object an its display
		- onSelect function([obj]): to be called when an option is clicked, it calls all the clicked objects
		- selectedOptions (list(obj)): selected options
*/

class MultipleSelectDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedOptions: this.props.selectedOptions
        ? this.props.selectedOptions
        : [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedOptions !== prevProps.selectedOptions) {
      this.setState({ selectedOptions: this.props.selectedOptions });
    }
  }

  onSelect = (options) => {
    let onSelectFunc = this.props.onSelect;
    if (typeof this.props.onSelect !== "function") {
      onSelectFunc = () => {};
    }
    onSelectFunc(options);
  };

  selectOption = (option) => {
    let selectedOptions = this.state.selectedOptions;

    let optionIndex = this.state.selectedOptions.indexOf(option);
    if (optionIndex === -1) {
      selectedOptions.push(option);
    } else {
      selectedOptions.splice(optionIndex, 1);
    }

    this.onSelect(selectedOptions);
  };

  displayTitle = () => {
    const { selectedOptions } = this.state;

    if (selectedOptions.length > 0) {
      if (this.props.titleDisplay) {
        return this.props.titleDisplay(selectedOptions);
      } else {
        return selectedOptions.map((e) => this.props.display(e)).join(", ");
      }
    }

    return this.props.noSelectionTitle;
  };

  renderCountTitle = () => {
    const { selectedOptions } = this.state;
    const selected = selectedOptions.length > 0 ? true : false;
    return (
      <div className="title">
        {this.props.iconTitle && (
          <div className={`icon icon--${this.props.iconTitle}`} />
        )}
        {selected ? <p className="count">({selectedOptions.length}) </p> : ""}
        <p>
          {selected ? this.props.selectionTitle : this.props.noSelectionTitle}
        </p>
      </div>
    );
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

  renderCheck = (active) => {
    const iconCheck = this.props.iconCheck ? this.props.iconCheck : "check";
    if (this.props.checkBox) {
      return (
        <div className={`check-box ${active}`}>
          <div className={`icon icon--${iconCheck}`}></div>
        </div>
      );
    }
    return <div className={`icon icon--${iconCheck} ${active}`}></div>;
  };

  renderSelectAll = () => {
    return (
      <div
        className="select-all"
        onClick={() => {
          if (
            this.state.selectedOptions.length >= 0 &&
            this.state.selectedOptions.length < this.props.options.length
          ) {
            this.props.options.forEach((propOption) => {
              let option = this.props.valueProperty
                ? propOption[this.props.valueProperty]
                : propOption;
              let optionIndex = this.state.selectedOptions.indexOf(option);
              if (optionIndex !== -1) {
                this.selectOption(option);
              }
            });
          }
        }}
      >
        <p>{this.props.noSelectionTitle}</p>
        <div
          className={`icon icon--radio-${
            this.state.selectedOptions.length === 0 ? "on" : "off"
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
        } multiple-select-dropdown`}
      >
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            {this.props.countTitle ? (
              this.renderCountTitle()
            ) : (
              <p>{this.displayTitle()}</p>
            )}
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
              const active =
                this.state.selectedOptions.indexOf(option) !== -1
                  ? "active"
                  : "";

              return (
                <div
                  key={
                    this.props.valueProperty
                      ? option
                      : this.props.options.indexOf(e)
                  }
                  className="dropdown-item"
                  onClick={() => this.selectOption(option)}
                >
                  {this.renderCheck(active)}
                  <p>{this.props.display(e)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}

export default MultipleSelectDropdown;
