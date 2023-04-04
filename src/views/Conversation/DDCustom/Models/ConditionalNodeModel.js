import { Toolkit } from "DDCanvas/main";
import _ from "lodash";

import {
  AnswerPortModel,
  ANSWER_PORT_TYPE_DEFAULT_CONDITION,
  ANSWER_PORT_TYPE_CONDITION,
} from "./AnswerPortModel";

import Toaster from "@bit/treble.components.toaster";

import { QuestionNodeModel } from "./QuestionNodeModel";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

export const CONDITION_TYPE = "CONDITION";

export const DEFAULT_CONDITION_VALUE = "CONT";
export const DEFAULT_CONDITION_DISPLAY = language.contains;
export const DEFAULT_CONDITTION_VARIABLE_VALUE = language.value;

export class ConditionalNodeModel extends QuestionNodeModel {
  constructor() {
    super();

    this.nodeType = "default-node-conditional";
    this.className = "ConditionalNodeModel";
    this.conditional_type = "CUSTOM";

    this.orderedClosedPorts = [];
    this.defaultConditionPort = new AnswerPortModel(
      language.defaultCondition,
      ANSWER_PORT_TYPE_DEFAULT_CONDITION
    );
    super.addPort(this.defaultConditionPort);

    this.variable = language.variable;

    const initialClosedPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CONDITION,
      this.variable
    );

    super.addPort(initialClosedPort);
    this.orderedClosedPorts.push(initialClosedPort);
    this.inputVariable = null;
  }

  deSerialize(object) {
    this.variable = object.variable;
    this.orderedClosedPorts = [];
    this.conditional_type = object.conditional_type;
    super.deSerialize(object);
  }

  serialize() {
    return _.merge(super.serialize(), {
      variable: this.variable,
      conditional_type: this.conditional_type,
    });
  }

  getOrderedClosedPorts() {
    return this.orderedClosedPorts;
  }

  getDefaultPort() {
    return this.defaultConditionPort;
  }

  setVariableValue(variable) {
    this.variable = variable;
    this.orderedClosedPorts.map((port) => {
      port.setConditionVariable(variable);
    });
    super.update("condition-variable", variable);
  }

  getVariableValue() {
    return this.variable;
  }

  getInputVariable() {
    return this.inputVariable;
  }

  getConditionalType() {
    return this.conditional_type;
  }

  setInputVariable(value) {
    this.inputVariable = value;
  }

  setConditionalType(type) {
    this.conditional_type = type;
    super.update("condition-type", type);
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
    const defaultPort = this.getDefaultPort();

    // clean ports
    this.cleanPorts();

    // define new ports
    const ports = [inPort, ...newOrderedClosedPorts, defaultPort];

    // add fresh ports
    ports.map((p) => {
      super.addPort(p);
    });
  }

  getPortIndex(port) {
    return this.orderedClosedPorts.indexOf(port);
  }

  duplicateClosedPort(port) {
    const newPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CONDITION,
      this.variable
    );
    newPort.deSerialize(port.serialize());
    newPort.id = Toolkit.UID();
    this.addPortAtIndex(this.orderedClosedPorts.indexOf(port), newPort);
  }

  newClosedPortAfterPort(port) {
    const newPort = new AnswerPortModel(
      "",
      ANSWER_PORT_TYPE_CONDITION,
      this.variable
    );
    const index = this.orderedClosedPorts.indexOf(port);

    this.addPortAtIndex(index + 1, newPort);
  }

  addPortAtIndex(index, port) {
    this.orderedClosedPorts.splice(index, 0, port);
    super.addPort(port);
  }

  addPort(port) {
    super.addPort(port);
    // addPort is used mainly to add ANSWER_PORT_TYPE_CONDITION but the else is required to render the node from the serialization
    if (port.answerType === ANSWER_PORT_TYPE_CONDITION) {
      this.orderedClosedPorts.push(port);
    } else {
      this.defaultConditionPort = port;
    }
  }

  removePort(port) {
    if (port.answerType === ANSWER_PORT_TYPE_CONDITION) {
      if (this.getOrderedClosedPorts().length == 1) return;

      this.orderedClosedPorts.splice(this.orderedClosedPorts.indexOf(port), 1);
    }
    super.removePort(port);
  }

  validatePort(port) {
    if (Object.keys(port.links).length == 0) {
      return false;
    }
    return true;
  }

  validateModel() {
    let ports = Array.from(this.orderedClosedPorts);

    let validPorts = true;
    ports.push(this.defaultConditionPort);
    ports.map((port) => {
      if (!this.validatePort(port)) {
        validPorts = false;
      }
    });
    return validPorts;
  }

  getAPISchema(nodeIDToAPIID) {
    if (!this.validateModel()) {
      this.setError(true);
      Toaster({
        title: language.defaultConditionErrorMissing,
        type: "error",
        closeButton: true,
      });
      return;
    }

    let apiSchema = {
      id: nodeIDToAPIID(this.getID()),
      question_type: CONDITION_TYPE,
      text: this.variable,
      conditional_type: this.conditional_type,
      visible_options: false,
      webhook_read: "",
      webhook_delivered: "",
    };

    let ports = Array.from(this.orderedClosedPorts);
    ports.push(this.defaultConditionPort);
    apiSchema["answers"] = ports.map((port) =>
      port.getAPISchema(nodeIDToAPIID)
    );

    return apiSchema;
  }
}
