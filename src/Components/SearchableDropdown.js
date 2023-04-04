import React, { Component } from "react";
import { connect } from "react-redux";

import operationsMainReducer from "./../duck/operations";
import getLanguage from "getLanguage.js";
import languages from "views/Conversation/languages";

import Dropdown from "./DropdownV2";

import "./SearchableDropdown.scss";
/*
	props:
		- options list(obj): options to be displayed
		- title str: dropdown button text
		- searchPlaceholder str: Placeholder of thesearch input
		- displayItem function(obj) -> str|Component: a map between an object an its display
		- toSearchStr function(obj) -> str: A map between an object an its searchable value
		- onSelect function(obj): to be called when an option is clicked, it calls the clicked object
		- triggerComponent Component: component to display on the trigger
    - hideOnOptionClick bool: Determine whether to hide the drowpdown when an option is clicked
    - renderOnNoResults function(obj) -> component to display on no results found
    - onHoverItem function(obj) -> component to display on hover on option
*/

class SearchableDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      hoverOption: null,
    };
  }

  langDict = languages[getLanguage()];

  displayItem = (item) => {
    if (typeof item === "string") return <p className="r lh-22">{item}</p>;
    else return this.props.displayItem(item);
  };

  hoverOption = (option) => {
    this.setState({ hoverOption: option });
  };

  selectOption = (option) => {
    if (typeof this.props.onSelect === "function") {
      this.setState({ searchText: "" });
      this.props.onSelect(option);
    }
  };

  onChange = ({ target: { value } }) => {
    this.setState({ searchText: value });
  };

  getfilteredOptions = () => {
    let searchText = this.state.searchText.toLowerCase();
    let { options } = this.props;

    // no searching
    if (!searchText) return this.props.options;

    // use toSearchStr function is available, otherwise use a default function
    let toSearchStr = this.props.toSearchStr;
    if (typeof this.props.toSearchStr !== "function") {
      try {
        let defaultToSearchStr = (option) => String(option);
        let optionsStr = options.map(defaultToSearchStr);
        toSearchStr = defaultToSearchStr;
      } catch (err) {
        throw "'filterBy' property must be provided";
      }
    }

    // filter by str contained
    return options.filter((option) =>
      toSearchStr(option).toLowerCase().includes(searchText)
    );
  };

  renderHoverPanel = () => {
    const { hoverOption } = this.state;
    return this.props.onHoverItem && hoverOption ? (
      <div className="hover-option-panel">
        {this.props.onHoverItem(hoverOption)}
      </div>
    ) : null;
  };

  renderOptions = () => {
    const filteredOptions = this.getfilteredOptions();

    if (filteredOptions.length > 0) {
      return (
        <div
          id="searcheable-items-only-icon"
          className="searchable-items"
          role="menu"
        >
          {this.getfilteredOptions().map((e) => {
            return (
              <div
                key={this.props.options.indexOf(e)}
                className="dropdown-item"
                onClick={() => {
                  this.selectOption(e);
                }}
                onMouseEnter={() => {
                  this.hoverOption(e);
                }}
                onMouseLeave={() => {
                  this.setState({ hoverOption: null });
                }}
              >
                {this.displayItem(e)}
              </div>
            );
          })}
        </div>
      );
    } else {
      return this.props.renderOnNoResults ? (
        this.props.renderOnNoResults()
      ) : (
        <div className="searchable-items">
          <h3 id="no-result-found"> {this.langDict.NoResultsFound} </h3>
        </div>
      );
    }
  };

  render = () => {
    return (
      <Dropdown
        title={this.props.title}
        hideOnBodyClick={false}
        triggerComponent={this.props.triggerComponent}
        className={this.props.className}
        type={"onlyIcon"}
        disableDiagramScroll={this.props.disableDiagramScroll}
        enableDiagramScroll={this.props.enableDiagramScroll}
        styleMode={this.props.styleMode}
      >
        <div className="searchable-dropdown-search-container">
          <p className="control has-icons-left">
            <input
              id="search-input"
              className="search-input"
              autoComplete="off"
              type="text"
              placeholder={this.props.searchPlaceholder}
              onChange={this.onChange}
              value={this.state.searchText}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </p>
        </div>
        {this.renderOptions()}
        {this.renderHoverPanel()}
      </Dropdown>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  disableDiagramScroll: () =>
    dispatch(operationsMainReducer.disableDiagramScroll()),
  enableDiagramScroll: () =>
    dispatch(operationsMainReducer.enableDiagramScroll()),
});

export default connect(null, mapDispatchToProps)(SearchableDropdown);
