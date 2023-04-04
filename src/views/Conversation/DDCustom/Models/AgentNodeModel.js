import _ from "lodash";

import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";

export class AgentNodeModel extends DefaultNodeModel {
  constructor(agentTag = "") {
    super("agent");

    this.nodeType = "agent";

    this.addPort(new DefaultPortModel(true, "input", "In"));
    this.agentTag = agentTag;

    this.className = "AgentNodeModel";
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
    this.agentTag = object.agentTag;
    this.color = object.color;
  }

  serialize() {
    return _.merge(super.serialize(), {
      agentTag: this.agentTag,
      color: this.color,
    });
  }

  getInPort() {
    let inPorts = this.getInPorts();

    if (inPorts.length < 1) return;

    return inPorts[0];
  }

  getAgentTag() {
    return this.agentTag;
  }

  setAgentTag(tag) {
    this.agentTag = tag;
    super.update("agent-tag", tag);
  }

  getAPISchema(nodeIDToAPIID) {
    return {
      id: nodeIDToAPIID(this.getID()),
      question_type: "AGENT",
      text: "",
      answers: [],
      agent_types: [this.getAgentTag()],
      visible_options: true,
      webhook_read: "",
      webhook_delivered: "",
    };
  }
}
