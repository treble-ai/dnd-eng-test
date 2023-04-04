import {
  ProbabilityPortModel,
  ANSWER_PORT_TYPE_PROBABILITY,
} from "./ProbabilityPortModel";

import { QuestionNodeModel } from "./QuestionNodeModel";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

export const AB_TYPE = "AB";

export class ABNodeModel extends QuestionNodeModel {
  constructor() {
    super();

    this.nodeType = "default-node-ab";
    this.className = "ABNodeModel";

    this.orderedProbabilityPorts = [];
    const defaultClosedPort1 = new ProbabilityPortModel(50);
    super.addPort(defaultClosedPort1);
    this.orderedProbabilityPorts.push(defaultClosedPort1);
    const defaultClosedPort2 = new ProbabilityPortModel(50);
    super.addPort(defaultClosedPort2);
    this.orderedProbabilityPorts.push(defaultClosedPort2);
  }

  deSerialize(object) {
    this.orderedProbabilityPorts = [];
    super.deSerialize(object);
  }

  getOrderedProbabilityPorts() {
    return this.orderedProbabilityPorts;
  }

  getTotalProbabilities() {
    let probability = 0;
    this.orderedProbabilityPorts.forEach((port) => {
      probability += port.probability;
    });
    return probability;
  }

  movePortFromToIndex(fromIndex, toIndex) {
    // previous orderedProbabilityPorts
    let oldOrderedProbabilityPorts = this.orderedProbabilityPorts;

    // copy of previous orederedProbabilityPorts
    let newOrderedProbabilityPorts = oldOrderedProbabilityPorts.slice();
    // answerPort that got moved
    let movedProbabilityPort = newOrderedProbabilityPorts[fromIndex];

    // remove moved port
    newOrderedProbabilityPorts.splice(fromIndex, 1);

    // add the moved port at the new index
    newOrderedProbabilityPorts.splice(toIndex, 0, movedProbabilityPort);

    this.orderedProbabilityPorts = newOrderedProbabilityPorts;

    const inPort = this.getInPort();

    // clean ports
    this.cleanPorts();

    // define new ports
    const ports = [inPort, ...newOrderedProbabilityPorts];

    // add fresh ports
    ports.map((p) => {
      super.addPort(p);
    });
  }

  getPortIndex(port) {
    return this.orderedProbabilityPorts.indexOf(port);
  }

  newProbabilityPortAfterPort(port) {
    const newPort = new ProbabilityPortModel(0);
    const index = this.orderedProbabilityPorts.indexOf(port);

    this.addPortAtIndex(index + 1, newPort);
  }

  addPortAtIndex(index, port) {
    this.orderedProbabilityPorts.splice(index, 0, port);
    super.addPort(port);
  }

  addPort(port) {
    super.addPort(port);
    if (port.answerType === ANSWER_PORT_TYPE_PROBABILITY) {
      this.orderedProbabilityPorts.push(port);
    }
  }

  removePort(port) {
    if (this.getOrderedProbabilityPorts().length == 2) return;

    this.orderedProbabilityPorts.splice(
      this.orderedProbabilityPorts.indexOf(port),
      1
    );
    super.removePort(port);
  }

  getAPISchema(nodeIDToAPIID) {
    if (this.getTotalProbabilities() !== 100) {
      alert(language.abProbabilitiesError);
      return null;
    }
    let apiSchema = {
      id: nodeIDToAPIID(this.getID()),
      question_type: AB_TYPE,
      text: "",
      visible_options: false,
      webhook_read: "",
      webhook_delivered: "",
    };

    let ports = Array.from(this.orderedProbabilityPorts);

    apiSchema["answers"] = ports.map((port) =>
      port.getAPISchema(nodeIDToAPIID)
    );

    return apiSchema;
  }
}
