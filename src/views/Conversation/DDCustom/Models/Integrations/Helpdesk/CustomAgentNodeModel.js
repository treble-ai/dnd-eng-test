import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import _ from "lodash";
export class CustomAgentNodeModel extends DefaultNodeModel {
  constructor(email = "") {
    super("CustomAgent");

    this.nodeType = "CustomAgent";

    this.addPort(new DefaultPortModel(true, "input", "In"));

    this.className = "CustomAgentNodeModel";
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
  }

  serialize() {
    return _.merge(super.serialize(), {});
  }

  getInPort() {
    let inPorts = this.getInPorts();

    if (inPorts.length < 1) return;

    return inPorts[0];
  }

  getAPISchema(nodeIDToAPIID) {
    return {
      id: nodeIDToAPIID(this.getID()),
      question_type: "INTEGRATION",
      text: "CUSTOMINTEGRATION",
      answers: [],
      options: {},
      visible_options: true,
      webhook_read: "",
      webhook_delivered: "",
    };
  }
}
