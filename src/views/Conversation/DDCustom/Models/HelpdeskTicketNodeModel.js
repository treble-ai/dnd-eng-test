import _ from "lodash";

import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import { AnswerPortModel, HELPDESK_TICKET_TYPE } from "./AnswerPortModel";

const defaultPipeline = { id: "0", stage: "1" };
const defaultProperties = { source_type: "WHATSAPP" };

export class HelpdeskTicketNodeModel extends DefaultNodeModel {
  constructor(
    text = "",
    properties = defaultProperties,
    pipeline = defaultPipeline
  ) {
    super();

    this.text = text;

    this.nodeType = "default-helpdesk-ticket";
    this.className = "HelpdeskTicketNodeModel";

    this.helpdeskType = text !== "" ? text : null;
    this.properties = properties;
    this.pipeline = pipeline;

    super.addPort(new DefaultPortModel(true, "input", "In"));
    super.addPort(new AnswerPortModel("", HELPDESK_TICKET_TYPE));
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);

    this.helpdeskType = object.helpdeskType;
    this.properties = object.properties;
    this.pipeline = object.pipeline;
  }

  serialize() {
    return _.merge(super.serialize(), {
      helpdeskType: this.helpdeskType,
      properties: this.properties,
      pipeline: this.pipeline,
    });
  }

  clone = () => {
    return new HelpdeskTicketNodeModel(
      this.helpdeskType,
      this.properties,
      this.pipeline
    );
  };

  getInPort() {
    return Object.values(this.getPorts()).find((elem) => elem.in);
  }

  getOutPort() {
    return Object.values(this.getPorts()).find((elem) => !elem.in);
  }

  isValidSchema() {
    // Prevent empty subject
    const subject = this.properties.subject;
    if (subject === null || subject === "") {
      return false;
    }

    return true;
  }

  saveValues() {
    super.update("save-ticket", {
      helpdeskType: this.helpdeskType,
      properties: this.properties,
      pipeline: this.pipeline,
    });
  }

  setValue(propertyName, propertyValue) {
    this.properties[propertyName] = propertyValue;
  }

  getValue(propertyName) {
    return this.properties[propertyName] ?? null;
  }

  setPipeline(pipelineId, pipelineStage) {
    this.pipeline = {
      id: pipelineId,
      stage: pipelineStage,
    };
  }

  getPipeline() {
    return this.pipeline;
  }

  clear() {
    this.properties = defaultProperties;
    this.pipeline = defaultPipeline;
  }

  getAPISchema(nodeIDToAPIID) {
    if (!this.isValidSchema()) {
      return null;
    }

    let usedProperties = {};
    Object.entries(this.properties).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (Array.isArray(value)) {
          usedProperties[key] = value.map((v) => v.value).join(";");
        } else if (typeof value === "object") {
          usedProperties[key] = value.value;
        } else {
          usedProperties[key] = value;
        }
      }
    });

    let apiSchema = {
      id: nodeIDToAPIID(this.getID()),
      question_type: HELPDESK_TICKET_TYPE,
      text: this.helpdeskType,
      visible_options: false,
      webhook_read: "",
      webhook_delivered: "",
      extra: {
        properties: usedProperties,
        pipeline: this.pipeline,
      },
    };

    apiSchema["answers"] = [this.getOutPort().getAPISchema(nodeIDToAPIID)];

    return apiSchema;
  }
}
