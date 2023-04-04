import React, { Component } from "react";
import TextInput from "Components/TextInput";

import "./Searchbar.scss";

export class Searchbar extends Component {
  /**
   *
   * @param {*} props
   * clear: function
   * value: string
   * placeholder: string
   * onChange: function
   * searchIcon: string
   * -- optional --
   * trackMessage: string
   * clear: function
   * clearButton: boolean
   */
  constructor(props) {
    super(props);
  }
  render() {
    const iconClearButton = this.props.iconClearButton;
    return (
      <div
        className={`searchbar ${this.props.class} ${
          this.props.value ? "typing" : ""
        }`}
      >
        <div
          className={`icon icon--${
            this.props.searchIcon ? this.props.searchIcon : "search-dark-grey"
          } icon-search`}
        />
        <TextInput
          type="text"
          placeholder={this.props.placeholder}
          onChange={(e) => {
            this.props.onChange(e.target.value);
          }}
          trackMessage={this.props.trackMessage}
          value={this.props.value}
        />
        {this.props.clearButton && this.props.value && (
          <div
            className={`clear-button icon icon--${
              iconClearButton ? iconClearButton : "close"
            }`}
            onClick={() => this.props.clear()}
          />
        )}
      </div>
    );
  }
}

export default Searchbar;
