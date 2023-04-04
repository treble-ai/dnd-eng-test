import React from "react";

import "./styles-v2.scss";

import InputPortWidget from "./InputPortWidget";
import ProbabilityPortWidget from "./ProbabilityPortWidget";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import iconABNode from "../../images/IconABTesting.svg";
import events from "utils/events";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

export class ABNodeWidget extends React.Component {
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

  renderProbabilityPorts() {
    const { node } = this.props;

    if (typeof node.getOrderedProbabilityPorts !== "function") return;

    const probabilityPorts = node.getOrderedProbabilityPorts();
    if (!probabilityPorts.length) return null;
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
              <ProbabilityPortWidget
                diagramEngine={this.props.diagramEngine}
                port={probabilityPorts[rubric.source.index]}
                key={probabilityPorts[rubric.source.index].getID()}
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
              {probabilityPorts.map((port, index) => (
                <Draggable
                  draggableId={`answer-closed-port-${port.getID()}`}
                  index={index}
                  key={`answer-closed-port-${port.getID()}`}
                  isDragDisabled={!this.state.canDrag}
                >
                  {(provided, snapshot) => (
                    <ProbabilityPortWidget
                      diagramEngine={this.props.diagramEngine}
                      port={port}
                      key={port.getID()}
                      innerRef={provided.innerRef}
                      provided={provided}
                      changeDrag={this.changeDrag}
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

  renderType = () => {
    return (
      <div className="closed-type">
        <figure className="image is-40x40">
          <img src={iconABNode} />
        </figure>
        <p className="section-title ab">{language.abTest}</p>
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
      <div
        className="question-node-v2 node-v2 ab-node"
        id="question-node-open"
        data-nodeid={node.getID()}
      >
        {this.renderInputPort()}
        {this.renderType()}
        <div>{this.renderProbabilityPorts()}</div>
      </div>
    );
  }
}
