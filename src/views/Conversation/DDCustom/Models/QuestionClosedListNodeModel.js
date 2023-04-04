import { Toolkit } from "DDCanvas/main";

import {
  AnswerPortModel,
  ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
} from "./AnswerPortModel";

import { QuestionNodeModel } from "./QuestionNodeModel";

const LIST_MAX = 10;

export class QuestionClosedListNodeModel extends QuestionNodeModel {
  constructor() {
    super();

    this.nodeType = "default-question-closed-list";
    this.className = "QuestionClosedListNodeModel";

    this.orderedClosedPorts = [];
    const defaultClosedPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
      "",
      24
    );
    super.addPort(defaultClosedPort);
    this.orderedClosedPorts.push(defaultClosedPort);
  }

  deSerialize(object) {
    this.orderedClosedPorts = [];
    super.deSerialize(object);
  }

  getClosedType() {
    return "LIST";
  }

  getOrderedClosedPorts() {
    return this.orderedClosedPorts;
  }

  movePortFromToIndex(fromIndex, toIndex) {
    // previous orderedClosedPorts
    let oldOrderedClosedPorts = this.orderedClosedPorts;

    // copy of previous orederedClosedPorts
    let newOrderedClosedPorts = oldOrderedClosedPorts.slice();
    // answerPort that got moved
    let movedClosedPort = newOrderedClosedPorts[fromIndex];

    // remove moved port
    newOrderedClosedPorts.splice(fromIndex, 1);

    // add the moved port at the new index
    newOrderedClosedPorts.splice(toIndex, 0, movedClosedPort);

    this.orderedClosedPorts = newOrderedClosedPorts;

    const inPort = this.getInPort();

    // clean ports
    this.cleanPorts();

    // define new ports
    const ports = [inPort, ...newOrderedClosedPorts];

    // add fresh ports
    ports.map((p) => {
      super.addPort(p);
    });
  }

  getPortIndex(port) {
    return this.orderedClosedPorts.indexOf(port);
  }

  duplicateClosedPort(port) {
    if (this.orderedClosedPorts.length >= LIST_MAX) {
      return;
    }
    const newPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
      "",
      24
    );
    newPort.deSerialize(port.serialize());
    newPort.id = Toolkit.UID();
    this.addPortAtIndex(this.orderedClosedPorts.indexOf(port), newPort);
  }

  newClosedPortAfterPort(port) {
    if (this.orderedClosedPorts.length >= LIST_MAX) {
      return;
    }
    const newPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
      "",
      24
    );
    const index = this.orderedClosedPorts.indexOf(port);

    this.addPortAtIndex(index + 1, newPort);
  }

  addPortAtIndex(index, port) {
    if (this.orderedClosedPorts.length >= LIST_MAX) {
      return;
    }
    this.orderedClosedPorts.splice(index, 0, port);

    super.addPort(port);
  }

  addPort(port) {
    super.addPort(port);
    if (port.answerType === ANSWER_PORT_TYPE_CLOSED_CONTROLLED) {
      this.orderedClosedPorts.push(port);
    }
  }

  removePort(port) {
    if (port.answerType === ANSWER_PORT_TYPE_CLOSED_CONTROLLED) {
      if (this.getOrderedClosedPorts().length == 1) return;

      this.orderedClosedPorts.splice(this.orderedClosedPorts.indexOf(port), 1);
    }
    super.removePort(port);
  }
}
