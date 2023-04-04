import React, { Component } from "react";

import SelectDropdown from "Components/SelectDropdown";
import NewComponentPill from "Components/NewComponentPill";
import SetGoalInNode from "Components/SetGoalInNode";

import {
  QuestionOpenNodeModel,
  QuestionClosedNodeModel,
  QuestionClosedButtonsNodeModel,
  QuestionClosedListNodeModel,
} from "views/Conversation/DDCustom/main";

import iconQuestionOpenImage from "./images/IconMessage.svg";
import iconQuestionClosedImage from "./images/IconQuestionClosed.svg";
import iconClosedButtons from "./images/IconClosedButtons.svg";
import iconClosedList from "./images/IconClosedList.svg";

import events from "utils/events";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";

const language = languages[getLanguage()];
const trackMessage = {
  "default-question-open": "open question",
  "default-question-closed": "closed question",
  "default-question-closed-buttons": "buttons question",
  "default-question-closed-list": "options list question",
};

export default class ChangeQuestionType extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleNodeChange = this.handleNodeChange.bind(this);
  }

  /************************************************************************************************************************
   ************************************************************************************************************************
   ************************************************************************************************************************/

  displayOption(node) {
    const renderHeaderIcon = (node) => {
      if (node.header !== undefined) {
        if (typeof node.header === "string") {
          return <div className={`icon icon--${node.header}`}></div>;
        } else {
          return node.header;
        }
      } else {
        return;
      }
    };

    return (
      <div className="card" id="question-card">
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-40x40">
                <img src={node.image} />
              </figure>
            </div>
            <div className="media-content">
              <div className="title-container">
                <p className="title is-4">{node.title}</p>
                {renderHeaderIcon(node)}
              </div>
              <p className="subtitle is-6">{node.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleNodeChange(node) {
    let diagramEngine = this.props.diagramEngine;
    let actualNode = this.props.node;

    let diagramModel = diagramEngine.getDiagramModel();

    let nodeModel = new node.model();

    nodeModel.x = actualNode.x;
    nodeModel.y = actualNode.y;
    nodeModel.text = actualNode.text;
    nodeModel.saveOnVariable = actualNode.saveOnVariable;
    nodeModel.location = actualNode.location;
    nodeModel.messageLimit = actualNode.messageLimit;
    nodeModel.messageLimitValue = actualNode.messageLimitValue;
    nodeModel.timer = actualNode.timer;
    nodeModel.timerValue = actualNode.timerValue;
    nodeModel.webhookRead = actualNode.webhookRead;
    nodeModel.webhookDelivered = actualNode.webhookDelivered;
    if (node.key != "ListClosedQuestion") {
      nodeModel.file = actualNode.file;
    }
    diagramModel.deactivateHistory();
    diagramModel.addNode(nodeModel);
    actualNode.remove();
    diagramModel.activateHistory();
    diagramModel.pushToHistory();

    diagramEngine.forceUpdate();
    this.forceUpdate();

    events.track("Change question type", {
      from_question_type: trackMessage[actualNode.nodeType],
      to_question_type: trackMessage[nodeModel.nodeType],
    });
  }

  render() {
    const nodes = [
      {
        key: "OpenQuestion",
        model: QuestionOpenNodeModel,
        title: language.openQuestion,
        image: iconQuestionOpenImage,
        description: language.openQuestionD,
      },
      {
        key: "OriginalClosedQuestion",
        model: QuestionClosedNodeModel,
        title: language.closedQuestion,
        image: iconQuestionClosedImage,
        description: language.closedQuestionD,
      },
      {
        key: "ButtonsClosedQuestion",
        model: QuestionClosedButtonsNodeModel,
        title: language.closedQuestionButtons,
        image: iconClosedButtons,
        description: language.closedQuestionButtonsD,
        header: <NewComponentPill label={language.new} color="pink" />,
      },
      {
        key: "ListClosedQuestion",
        model: QuestionClosedListNodeModel,
        title: language.closedQuestionList,
        image: iconClosedList,
        description: language.closedQuestionListD,
        header: <NewComponentPill label={language.new} color="pink" />,
      },
    ];

    return (
      <div className="change-question-type-container">
        <SetGoalInNode
          node={this.props.node}
          forceUpdate={this.props.forceUpdate}
          diagramEngine={this.props.diagramEngine}
        />
        <SelectDropdown
          options={nodes.filter(
            (node) => !(this.props.node instanceof node.model)
          )}
          triggerComponent={
            <div className="change-question">
              <div className="icon icon--change" />
            </div>
          }
          className="change-question-dropdown"
          onSelect={this.handleNodeChange}
          direction="right"
          display={this.displayOption}
        />
      </div>
    );
  }
}
