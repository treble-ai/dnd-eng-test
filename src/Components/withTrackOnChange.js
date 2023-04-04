import React, { Component } from "react";
import events from "utils/events";

export default function withTrackOnChange(InputComponent) {
  class WithTrackOnChange extends Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.trackInputText = this.debounce(events.track, 1000);
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    handleChange(e) {
      const { trackMessage, trackData, onChange } = this.props;
      const data = { text: e.target.value, ...trackData };
      if (trackMessage) this.trackInputText(trackMessage, data);
      if (onChange) onChange(e);
    }

    render() {
      const { trackMessage, trackData, onChange, ...inputProps } = this.props;
      return <InputComponent onChange={this.handleChange} {...inputProps} />;
    }
  }

  WithTrackOnChange.displayName = `WithTrackOnChange(${getDisplayName(
    InputComponent
  )})`;
  return WithTrackOnChange;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
