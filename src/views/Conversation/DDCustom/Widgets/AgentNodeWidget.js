import React from "react";
import _ from "lodash";
import { AgentNodeModel } from "../Models/AgentNodeModel";

import "./styles-v2.scss";

export class AgentNodeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingAttr: false,
    };

    this.removeQuestionPort = this.removeQuestionPort.bind(this);
    this.remove = this.remove.bind(this);
  }

  remove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  removeQuestionPort(port) {
    const { node, diagramEngine } = this.props;
    const removePort = node.removePortNode;
    removePort(port);
    diagramEngine.forceUpdate();
  }

  getInputPort() {
    const { node } = this.props;

    const port = node.getInPort();
    const showLinkRoute = port.getShowLinkRoute() && !_.isEqual(port.links, {});
    return (
      <div className="agent-port-input">
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
          className={`ball port  ${showLinkRoute ? "show-link" : ""}`}
          data-name={port.getID()}
          data-nodeid={node.getID()}
          id={port.getID()}
        >
          {showLinkRoute && <div className="icon icon--arrow-backward" />}
        </div>
      </div>
    );
  }

  render() {
    const { node } = this.props;
    const { agentTag, color } = node;
    const style = {};
    if (color) {
      style.background = color;
    }

    return (
      <div id="agent-node">
        <div className="agent-node--body">
          <div className="ico-agent"></div>
          <p>{agentTag}</p>
          {this.getInputPort()}
        </div>
      </div>
    );
  }
}
