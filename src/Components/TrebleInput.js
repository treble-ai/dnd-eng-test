import React, { PureComponent } from "react";
import { Input, InputNumber } from "antd";

import "./TrebleInput.scss";

export default class TrebleInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  onChange = (e) => {
    const inputType = this.props.type ? this.props.type : "TEXT";
    let value;
    if (inputType === "TEXT") {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({ value });
    this.props.onChange(value);
  };

  render = () => {
    const inputType = this.props.type ? this.props.type : "TEXT";

    if (inputType === "TEXT") {
      return (
        <Input
          className="treble-input"
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          value={this.state.value}
        />
      );
    } else if (inputType === "NUMBER") {
      return (
        <InputNumber
          className="treble-input"
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          value={this.state.value}
          type="number"
        />
      );
    }
  };
}
