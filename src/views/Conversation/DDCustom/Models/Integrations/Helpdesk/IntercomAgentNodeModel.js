import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import _ from "lodash";
export class IntercomAgentNodeModel extends DefaultNodeModel {
  constructor(email = "") {
    super("IntercomAgent");

    this.nodeType = "IntercomAgent";

    this.addPort(new DefaultPortModel(true, "input", "In"));

    this.className = "IntercomAgentNodeModel";
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
      text: "INTERCOM",
      answers: [],
      options: {},
      visible_options: true,
      webhook_read: "",
      webhook_delivered: "",
    };
  }
}
