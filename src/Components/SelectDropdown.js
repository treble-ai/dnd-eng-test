import React, { PureComponent } from "react";

import Dropdown from "./DropdownV2";

import "./SelectDropdown.scss";

/*
	props:
    - options list(obj): options to be displayed
    - categories list(obj): categories of the menus 
		- noSelectionTitle str: text to be displayed when empty
		- display function(obj) -> str|Component: a map between an object an its display
		- onSelect function([obj]): to be called when an option is clicked, it calls all the clicked objects
    - hideOnOptionClick bool: Determine whether to hide the drowpdown when an option is clicked
    - menuWidth int: width of the menu
    - buttonWidth int: width of the button
    - className str: class to pass on for further control of the menu
    - direction str: direction to place the menu (Default:down)
    - value (obj | str): initialize dropdown with the option selected
    - dropdownIcon
*/

export default class SelectDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedOption: this.props.value ? this.props.value : null,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.value != this.props.value) {
      this.setState({ selectedOption: this.props.value });
    }
  };

  selectOption = (option, trigger) => {
    let close = trigger(option);

    this.setState({ selectedOption: option });

    if (typeof close === "boolean") {
      this.setState({ open: !close });
      this.drowpdownRef.instanceRef.toggle(!close);
      return;
    }

    if (this.props.hideOnOptionClick === false) return;

    this.props.handleTypeCondition &&
      this.props.handleTypeCondition(option.type);
  };

  displayTitle = () => {
    // No option selected
    if (this.state.selectedOption == null) {
      if (this.props.noSelectionTitle !== undefined) {
        return this.props.noSelectionTitle;
      }
      return "";
    }
    if (typeof this.props.customTitleDisplay === "function") {
      return this.props.customTitleDisplay(this.state.selectedOption)
    }
    // Option is selected
    if (typeof this.props.display === "function")
      return this.props.display(this.state.selectedOption);

    return this.state.selectedOption;
  };

  displayItem = (item) => {
    if (typeof this.props.display == "function")
      return this.props.display(item);
    if (typeof item === "string") return <p className="r lh-22">{item}</p>;
    else return item;
  };

  render = () => {
    let onSelect = this.props.onSelect;
    let hideOnOptionClick =
      this.props.hideOnOptionClick === false ? false : true;
    let hideOnClickOutside =
      this.props.hideOnClickOutside === false ? false : true;

    if (typeof onSelect !== "function") onSelect = () => {};
    return (
      <Dropdown
        title={this.displayTitle()}
        hideOnBodyClick={hideOnOptionClick}
        hideOnClickOutside={hideOnClickOutside}
        triggerComponent={this.props.triggerComponent}
        menuWidth={this.props.menuWidth}
        buttonWidth={this.props.buttonWidth}
        direction={this.props.direction}
        className={this.props.className}
        subClassName={this.props.subClassName}
        dropdownIcon={this.props.dropdownIcon}
        ref={(drowpdownRef) => (this.drowpdownRef = drowpdownRef)}
      >
        {this.props.options.map((e) => {
          return (
            <div
              key={this.props.options.indexOf(e)}
              className="dropdown-item"
              onClick={() => {
                this.selectOption(e, onSelect);
              }}
            >
              {this.displayItem(e)}
            </div>
          );
        })}
      </Dropdown>
    );
  };
}
