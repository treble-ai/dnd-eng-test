import React from "react";
import _ from "lodash";

export default class OutPortWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { port } = this.props;
    const node = port.getParent();
    const showLinkRoute = port.getShowLinkRoute() && !_.isEqual(port.links, {});
    return (
      <div className="port-output">
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
          {showLinkRoute && <div className="icon icon--arrow-forward" />}
        </div>
        <div className="line"></div>
      </div>
    );
  }
}
