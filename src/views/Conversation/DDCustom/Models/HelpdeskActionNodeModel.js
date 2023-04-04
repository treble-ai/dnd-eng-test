import _ from "lodash";

import { DefaultNodeModel, DefaultPortModel, COPY_OFFSET } from "DDCanvas/main";
import { AnswerPortModel, HELPDESK_ACTION_TYPE } from "./AnswerPortModel";

export class HelpdeskActionNodeModel extends DefaultNodeModel {
  constructor(text = "", variable = null, value = null, action = null) {
    super();

    this.text = text;

    this.nodeType = "default-helpdesk-action";
    this.className = "HelpdeskActionNodeModel";

    this.helpdeskType = text !== "" ? text : null;

    this.variable = variable;
    this.value = value;
    this.action = action;

    super.addPort(new DefaultPortModel(true, "input", "In"));
    super.addPort(new AnswerPortModel("", HELPDESK_ACTION_TYPE));
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);

    this.helpdeskType = object.helpdeskType;

    this.variable = object.variable;
    this.value = object.value;
    this.action = object.action;
  }

  serialize() {
    return _.merge(super.serialize(), {
      helpdeskType: this.helpdeskType,

      variable: this.variable,
      value: this.value,
      action: this.action,
    });
  }

  clone = () => {
    return new HelpdeskActionNodeModel(
      this.helpdeskType,
      this.variable,
      this.value,
      this.action
    );
  };

  getVariable = () => {
    return this.variable;
  };

  getValue = () => {
    return this.value;
  };

  getAction = () => {
    return this.action;
  };

  saveValues = (variable, value, action) => {
    this.variable = variable;
    this.value = value;
    this.action = action;

    super.update("crm-action", {
      action,
      variable,
      value,
    });
  };

  getInPort() {
    return Object.values(this.getPorts()).find((elem) => elem.in);
  }

  getOutPort() {
    return Object.values(this.getPorts()).find((elem) => !elem.in);
  }

  isValidSchema() {
    // Prevent empty node
    if (this.value === null || this.variable === null || this.action === null) {
      return false;
    }

    return true;
  }

  formatValueForApiSchema() {
    if (this.variable.type === "INPUT") {
      return this.value;
    } else if (this.variable.type === "SELECT") {
      return this.value.value;
    } else if (this.variable.type === "MULTI-SELECT") {
      return this.value.map((v) => v.value);
    }
  }

  getAPISchema(nodeIDToAPIID) {
    if (!this.isValidSchema()) {
      return null;
    }

    let apiSchema = {
      id: nodeIDToAPIID(this.getID()),
      question_type: HELPDESK_ACTION_TYPE,
      text: this.helpdeskType,
      visible_options: false,
      webhook_read: "",
      webhook_delivered: "",
      extra: {
        action: this.action.value,
        variable: this.variable.value,
        value: this.formatValueForApiSchema(),
      },
    };

    apiSchema["answers"] = [this.getOutPort().getAPISchema(nodeIDToAPIID)];

    return apiSchema;
  }
}
