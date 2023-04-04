import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import _ from "lodash";
export class HubSpotAgentNodeModel extends DefaultNodeModel {
  constructor(agentTag = "", hubspotEmail = "", version = "V2") {
    super("HubSpotAgent");

    this.nodeType = "HubSpotAgent";

    this.addPort(new DefaultPortModel(true, "input", "In"));
    this.agentTag = agentTag;
    this.hubspotEmail = hubspotEmail;

    this.version = version;

    this.className = "HubSpotAgentNodeModel";
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
    this.version = object.version ? object.version : "V2";
    this.agentTag = object.agentTag ? object.agentTag : "";
    this.hubspotEmail = object.hubspotEmail ? object.hubspotEmail : "";
  }

  serialize() {
    return _.merge(super.serialize(), {
      version: this.version,
      hubspotEmail: this.hubspotEmail,
      agentTag: this.agentTag,
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
    super.update("hubspot-tag", tag);
  }

  getHubSpotEmail() {
    return this.hubspotEmail;
  }

  setHubSpotEmail(email) {
    this.hubspotEmail = email;
  }

  getVersion() {
    return this.version;
  }

  setVersion(version) {
    this.version = version;
  }

  getAPISchema(nodeIDToAPIID) {
    if (this.version === "V2") {
      return {
        id: nodeIDToAPIID(this.getID()),
        question_type: "AGENT",
        text: "HUBSPOT",
        answers: [],
        agent_types: [this.getAgentTag()],
        visible_options: true,
        webhook_read: "",
        webhook_delivered: "",
      };
    } else {
      return {
        id: nodeIDToAPIID(this.getID()),
        question_type: "INTEGRATION",
        text: "HUBSPOT",
        answers: [],
        options: { email: this.hubspotEmail },
        visible_options: true,
        webhook_read: "",
        webhook_delivered: "",
      };
    }
  }
}
