import React, { Component } from "react";
import { Select } from "antd";
import TrebleIcon from "Components/TrebleIcon";

import "./MultipleSelectDropdownV2.scss";
const { Option } = Select;
export default class MultipleSelectDropdownV2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: this.props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ selectedOptions: this.props.value });
    }
  }

  onChange = (selectedOptions) => {
    console.log("Selected", selectedOptions);
    const options = this.props.options.filter((option) =>
      selectedOptions.includes(option.value)
    );
    this.props.onChange(options);
  };

  renderOption = (option) => {
    if (this.props.renderOption) {
      return this.props.renderOption(option);
    } else {
      return <div>{option.label}</div>;
    }
  };

  renderCheckbox = (option) => {
    let checked;
    if (this.state.selectedOptions.includes(option)) {
      checked = <TrebleIcon name="white-check" size={10} />;
    }
    return <div className="checkbox">{checked}</div>;
  };

  render = () => {
    const optionHeight = this.props.optionHeight ? this.props.optionHeight : 32;
    const listHeight = this.props.listHeight ? this.props.listHeight : 250;
    return (
      <Select
        mode="multiple"
        placeholder={this.props.placeholder}
        className="treble-multiselect-dropdown"
        dropdownClassName="treble-multiselect-dropdown"
        onChange={this.onChange}
        showSearch={false}
        suffixIcon={<TrebleIcon name="dropdown-arrow" />}
        showArrow
        listItemHeight={optionHeight}
        listHeight={listHeight}
        value={this.state.selectedOptions.map((option) => option.value)}
      >
        {this.props.options.map((option) => (
          <Option key={option.value}>
            {this.renderCheckbox(option)}
            {this.renderOption(option)}
          </Option>
        ))}
      </Select>
    );
  };
}
