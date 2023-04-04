import React, { Fragment } from "react";

import "./styles-v2.scss";
import Switch from "../../../../Components/Switch";
import Textarea from "react-textarea-autosize";
import HelpdeskPropertySelector from "Components/HelpdeskPropertySelector";

import InputPortWidget from "./InputPortWidget";
import AnswerPortWidget from "./AnswerPortWidget";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import ImageTooltip from "../../ImageTooltip";
import ChangeQuestionType from "views/Conversation/ChangeQuestionType";
import iconClosedList from "../../images/IconClosedList.svg";
import events from "utils/events";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

const QUESTION_PLACEHOLDER = language.write;
const ALT_PORT_LABEL = language.altFlux;

export class QuestionClosedListNodeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.renderNotAnswerTimeoutPort =
      this.renderNotAnswerTimeoutPort.bind(this);
    this.onToggleSwitch = this.onToggleSwitch.bind(this);
    this.changeDrag = this.changeDrag.bind(this);

    this.state = {
      canDrag: false,
    };
  }

  onToggleSwitch(newState) {
    const { node, diagramEngine } = this.props;
    node.setHasNotAnswerTimeoutPort(newState);
    diagramEngine.forceUpdate();
    this.forceUpdate();
  }

  onClickDefaultAnswerButton() {
    const { node, diagramEngine } = this.props;
    node.addDefaultClosedAnswerPort();
    diagramEngine.forceUpdate();
    this.forceUpdate();
  }

  renderInputPort() {
    const { node } = this.props;

    const port = node.getInPort();

    if (!port) return;

    return <InputPortWidget name={port.name} port={port} />;
  }

  onDragEnd(result, node) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let diagramModel = this.props.diagramEngine.getDiagramModel();
    diagramModel.deactivateHistory();
    node.movePortFromToIndex(result.source.index, result.destination.index);
    diagramModel.activateHistory();
    diagramModel.pushToHistory();
    events.track("Switch answers order");
    this.setState({ canDrag: false });
    this.props.diagramEngine.forceUpdate();
  }

  changeDrag(newDrag) {
    this.setState({ canDrag: newDrag });
  }

  renderAnswerClosedPorts() {
    const { node } = this.props;

    if (typeof node.getOrderedClosedPorts !== "function") return;

    const answerClosedPorts = node.getOrderedClosedPorts();
    if (!answerClosedPorts.length) return null;
    return (
      <DragDropContext
        onDragEnd={(result) => this.onDragEnd(result, node)}
        onDragUpdate={() => this.props.diagramEngine.forceUpdate()}
      >
        <Droppable
          droppableId={`answer-closed-port-container-${node.getID()}`}
          key={`answer-closed-port-container-${node.getID()}`}
          renderClone={(provided, snapshot, rubric) => (
            <div id="dragging-answer-port">
              <AnswerPortWidget
                diagramEngine={this.props.diagramEngine}
                port={answerClosedPorts[rubric.source.index]}
                key={answerClosedPorts[rubric.source.index].getID()}
                innerRef={provided.innerRef}
                provided={provided}
                style={provided.draggableProps.style}
              />
            </div>
          )}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              key={`answer-closed-port-container-div-${node.getID()}`}
            >
              {answerClosedPorts.map((port, index) => (
                <Draggable
                  draggableId={`answer-closed-port-${port.getID()}`}
                  index={index}
                  key={`answer-closed-port-${port.getID()}`}
                  isDragDisabled={this.props.hsm ? true : !this.state.canDrag}
                >
                  {(provided, snapshot) => (
                    <AnswerPortWidget
                      diagramEngine={this.props.diagramEngine}
                      port={port}
                      key={port.getID()}
                      innerRef={provided.innerRef}
                      provided={provided}
                      changeDrag={this.changeDrag}
                      nodeWidgetForceUpdate={this.forceUpdate.bind(this)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  renderNotAnswerTimeoutPort() {
    const { node } = this.props;
    const timeoutPort = node.getNotAnswerTimeoutPort();

    if (!timeoutPort) return null;

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={timeoutPort}
        key={timeoutPort.getID()}
      />
    );
  }

  renderNotAnswerTimeoutContainer() {
    const { node } = this.props;
    return (
      <div className="alt-port-container flex">
        <div className="alt-port-controller">
          <ImageTooltip
            imageName="alt_flux"
            title={language.altFlux}
            message={language.altFluxMsg}
            itemtohover={<div className="icon icon--info" />}
            placement="bottom"
            onToggle={(show) => {
              if (show) events.track("Hover on alternate flow help");
            }}
          />

          {ALT_PORT_LABEL}
          <span className="fill" />
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <Switch
              active={Boolean(node.getNotAnswerTimeoutPort())}
              onChange={this.onToggleSwitch}
            />
          </div>
        </div>
        {this.renderNotAnswerTimeoutPort()}
      </div>
    );
  }

  renderDefaultClosedAnswerPort() {
    const { node } = this.props;
    const defaultPort = node.getDefaultClosedAnswerPort();

    if (!defaultPort) {
      return (
        <div className="answer-button-container">
          <div
            className="answer-button"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              this.onClickDefaultAnswerButton();
            }}
          >
            {language.defaultAnswer}
          </div>
        </div>
      );
    }

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={defaultPort}
        key={defaultPort.getID()}
        nodeWidgetForceUpdate={this.forceUpdate.bind(this)}
      />
    );
  }

  renderDefaultClosedAnswerContainer() {
    return (
      <div className="default-answer-port-container">
        {this.renderDefaultClosedAnswerPort()}
      </div>
    );
  }

  renderTextarea() {
    const { node } = this.props;
    return (
      <Fragment>
        <Textarea
          placeholder={QUESTION_PLACEHOLDER}
          value={node.getText()}
          onChange={(e) => {
            node.setText(e.target.value);
            e.stopPropagation();
            this.forceUpdate();
          }}
        />
        {this.props.hasHubspotIntegration && (
          <HelpdeskPropertySelector
            language={language}
            searchPlaceholder={language.searchByNamePH}
            onSelect={(e) => {
              node.setText(`${node.getText()} {{hubspot_${e.value}}}`);
              this.forceUpdate();
            }}
          />
        )}
      </Fragment>
    );
  }

  renderType = () => {
    return (
      <div className="closed-type">
        <figure className="image is-40x40">
          <img src={iconClosedList} />
        </figure>
        <p className="section-title list">{language.list}</p>
      </div>
    );
  };

  render() {
    const { node } = this.props;

    const { color } = node;
    const style = {};
    if (color) {
      style.background = color;
    }

    return (
      <div className="whole-question-container">
        <ChangeQuestionType
          diagramEngine={this.props.diagramEngine}
          node={node}
          forceUpdate={this.forceUpdate.bind(this)}
        />
        <div
          className="question-node-v2 node-v2 closed-list"
          id="question-node-open"
          data-nodeid={node.getID()}
        >
          <div className="textarea-wrapper">
            {this.renderInputPort()}
            {this.renderTextarea()}
          </div>
          {this.renderType()}
          {this.renderAnswerClosedPorts()}
          {this.renderDefaultClosedAnswerContainer()}
          <hr />
          {this.renderNotAnswerTimeoutContainer()}
        </div>
      </div>
    );
  }
}
