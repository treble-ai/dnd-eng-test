import React, { Component } from "react";
import { Select, Input } from "antd";
import TrebleIcon from "Components/TrebleIcon";
import { SearchOutlined } from "@ant-design/icons";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";

import "./SearchableDropdownV2.scss";
const { Option } = Select;
const language = languages[getLanguage()];
export default class SearchableDropdownV2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
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
      (option) => option.value == key
    )[0];
    this.props.onSelect(option);
  };

  onSearchChange = ({ target: { value } }) => {
    this.setState({ searchText: value });
  };

  renderOption = (option) => {
    if (this.props.renderOption) {
      return this.props.renderOption(option);
    } else {
      return <div>{option.label}</div>;
    }
  };

  filterOptions = (options) => {
    let searchText = this.state.searchText.toLowerCase();

    // No searching
    if (!searchText) return options;

    // Use searchBy function is available, otherwise use a default function
    let searchBy = this.props.searchBy;
    if (typeof searchBy !== "function") {
      try {
        let defaultToSearchStr = (option) => String(option);
        searchBy = defaultToSearchStr;
      } catch (err) {
        throw "'searchBy' property must be provided";
      }
    }

    // Filter by str contained
    return options.filter((option) =>
      searchBy(option).toLowerCase().includes(searchText)
    );
  };

  renderNoResults = () => {
    return (
      <div className="treble-empty">
        <p>{language.noResults}</p>
      </div>
    );
  };

  render = () => {
    const optionHeight = this.props.optionHeight ? this.props.optionHeight : 32;
    const listHeight = this.props.listHeight ? this.props.listHeight : 250;
    const filteredOptions = this.filterOptions(this.props.options);
    return (
      <Select
        placeholder={this.props.placeholder}
        className={`treble-searchable-dropdown ${
          this.props.mode ? this.props.mode : ""
        }`}
        dropdownClassName={`treble-searchable-dropdown ${
          this.props.mode ? this.props.mode : ""
        }`}
        dropdownRender={(menu) => (
          <div>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder={this.props.searchPlaceholder}
              prefix={<SearchOutlined />}
              allowClear
            />
            {menu}
          </div>
        )}
        onSelect={this.onSelect}
        listItemHeight={optionHeight}
        listHeight={listHeight}
        value={this.state.selectedOption}
        notFoundContent={this.renderNoResults()}
        suffixIcon={<TrebleIcon name="dropdown-arrow" />}
      >
        {filteredOptions.map((option) => (
          <Option key={option.value}>
            {this.renderOption(option)}
            {option.label === this.state.selectedOption ? (
              <TrebleIcon
                name={
                  this.props.mode == "white" ? "cursive-check" : "white-check"
                }
                size={18}
              />
            ) : null}
          </Option>
        ))}
      </Select>
    );
  };
}
