import React, { Component } from "react";
import { Select } from "antd";
import TrebleIcon from "Components/TrebleIcon";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";

import "./SelectDropdownV2.scss";
const { Option } = Select;
const language = languages[getLanguage()];

export default class SelectDropdownV2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: this.props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ selectedOption: this.props.value });
    }
  }

  onSelect = (key) => {
    console.log("Selected", key);
    const option = this.props.options.filter(
      (option) => option.value === key
    )[0];
    this.props.onSelect(option);
  };

  renderOption = (option) => {
    if (this.props.renderOption) {
      return this.props.renderOption(option);
    } else {
      return <div>{option.label}</div>;
    }
  };

  renderSelected = (option, selectedIcon, notSelectedIcon) => {
    let valueKey = this.props.valueKey ? "value" : "label";
    return option[valueKey] === this.state.selectedOption
      ? selectedIcon
      : notSelectedIcon;
  };

  render = () => {
    let options = this.props.options;
    let selectedIcon = <TrebleIcon name="white-check" size={18} />;
    let noSelectedIcon = null;
    if (this.props.addEmptyOption) {
      options = [{ label: language.none, value: null }, ...this.props.options];
    }
    let suffixIcon = <TrebleIcon name="dropdown-arrow" />;

    if (this.props.selectedIcon) {
      selectedIcon = <TrebleIcon name={this.props.selectedIcon} size={18} />;
    }

    if (this.props.noSelectedIcon) {
      noSelectedIcon = (
        <TrebleIcon name={this.props.noSelectedIcon} size={18} />
      );
    }

    if (this.props.suffixIcon) {
      suffixIcon = <TrebleIcon name={this.props.suffixIcon} />;
    }

    const optionHeight = this.props.optionHeight ? this.props.optionHeight : 32;
    const listHeight = this.props.listHeight ? this.props.listHeight : 250;

    let className = "treble-select-dropdown";
    if (this.state.selectedOption !== null) {
      className += ` has-value`;
    }
    if (this.props.className !== undefined) {
      className += ` ${this.props.className}`;
    }

    return (
      <Select
        placeholder={this.props.placeholder}
        className={className}
        dropdownClassName={className}
        onSelect={this.onSelect}
        listItemHeight={optionHeight}
        listHeight={listHeight}
        value={this.state.selectedOption}
        suffixIcon={suffixIcon}
      >
        {options.map((option) => (
          <Option key={option.value}>
            {this.renderOption(option)}
            {this.renderSelected(option, selectedIcon, noSelectedIcon)}
          </Option>
        ))}
      </Select>
    );
  };
}
