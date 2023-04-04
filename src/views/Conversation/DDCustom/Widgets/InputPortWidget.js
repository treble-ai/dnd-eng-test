import React from "react";
import _ from "lodash";

export default class InputPortWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { port } = this.props;
    const node = port.getParent();
    const showLinkRoute = port.getShowLinkRoute() && !_.isEqual(port.links, {});
    return (
      <div className="port-input">
        <div
          onMouseEnter={() => {
            if (!_.isEqual(port.links, {}) && !port.getShowLinkRoute()) {
              port.setShowLinkRoute(true);
              this.forceUpdate();
            }
          }}
          onMouseLeave={() => {
            if (port.getShowLinkRoute()) {
              port.setShowLinkRoute(false);
              this.forceUpdate();
            }
          }}
          className={`ball port ${showLinkRoute ? "show-link" : ""}`}
          data-name={port.getID()}
          data-nodeid={node.getID()}
          id={port.getID()}
        >
          {showLinkRoute && <div className="icon icon--arrow-backward" />}
        </div>
        <div className="line"></div>
      </div>
    );
  }
}
