import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import _ from "lodash";
export class FreshdeskAgentNodeModel extends DefaultNodeModel {
  constructor(email = "") {
    super("FreshdeskAgent");

    this.nodeType = "FreshdeskAgent";

    this.addPort(new DefaultPortModel(true, "input", "In"));
    this.email = email;

    this.className = "FreshdeskAgentNodeModel";
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
    this.email = object.email;
  }

  serialize() {
    return _.merge(super.serialize(), {
      email: this.email,
    });
  }

  getInPort() {
    let inPorts = this.getInPorts();

    if (inPorts.length < 1) return;

    return inPorts[0];
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getAPISchema(nodeIDToAPIID) {
    return {
      id: nodeIDToAPIID(this.getID()),
      question_type: "INTEGRATION",
      text: "FRESHDESK",
      answers: [],
      options: { email: this.email },
      visible_options: true,
      webhook_read: "",
      webhook_delivered: "",
    };
  }
}
