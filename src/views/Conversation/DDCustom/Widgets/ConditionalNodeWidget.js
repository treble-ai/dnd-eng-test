import React from "react";

import "./styles-v2.scss";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";

import InputPortWidget from "./InputPortWidget";
import AnswerPortWidget from "./AnswerPortWidget";
import events from "utils/events";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

const QUESTION_PLACEHOLDER = language.write;

export class ConditionalNodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.changeDrag = this.changeDrag.bind(this);

    this.state = {
      canDrag: false,
    };
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

  renderDefaultClosedPort() {
    const { node } = this.props;

    if (typeof node.getDefaultPort !== "function") return;

    const defaultPort = node.getDefaultPort();

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={defaultPort}
        key={defaultPort.getID()}
      />
    );
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
                disabled={true}
                enumerate={false}
                nodeWidgetForceUpdate={this.forceUpdate.bind(this)}
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
                  isDragDisabled={!this.state.canDrag}
                >
                  {(provided, snapshot) => (
                    <AnswerPortWidget
                      diagramEngine={this.props.diagramEngine}
                      port={port}
                      key={port.getID()}
                      innerRef={provided.innerRef}
                      provided={provided}
                      changeDrag={this.changeDrag}
                      disabled={true}
                      enumerate={false}
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

  render() {
    const { node } = this.props;
    const answerOpenPort = node.getAnswerOpenPort();

    const { name, color } = node;
    const style = {};
    if (color) {
      style.background = color;
    }

    return (
      <div className="node-v2" id="conditional-node" data-nodeid={node.getID()}>
        <div className="node-header">{language.condition}</div>
        {this.renderInputPort()}
        {this.renderAnswerClosedPorts()}
        <hr />
        {this.renderDefaultClosedPort()}
      </div>
    );
  }
}
