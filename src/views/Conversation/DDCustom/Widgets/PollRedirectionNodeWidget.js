import React from "react";
import _ from "lodash";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
import iconLinkConversationImage from "../../images/IconLinkConversation.svg";

import "./styles-v2.scss";

const language = languages[getLanguage()];

export class PollRedirectionNodeWidget extends React.Component {
  constructor(props) {
    super(props);

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
    const { poll } = node;

    const renderPoll = (poll) => {
      if (poll !== null) {
        return (
          <p>
            {poll.id} - {poll.name}
          </p>
        );
      } else {
        return <p>{language.selectPoll}</p>;
      }
    };

    return (
      <div id="poll-redirection-node">
        {this.getInputPort()}
        <div className="poll-redirection-node--body">
          <img src={iconLinkConversationImage} />
          <div className="poll-redirection-node--info">
            <p>
              <b>{language.redirectToPoll}</b>
            </p>
            {renderPoll(poll)}
          </div>
        </div>
      </div>
    );
  }
}
