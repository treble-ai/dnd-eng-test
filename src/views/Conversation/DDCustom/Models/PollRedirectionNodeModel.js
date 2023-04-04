import _ from "lodash";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";

import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
const language = languages[getLanguage()];
export class PollRedirectionNodeModel extends DefaultNodeModel {
  constructor() {
    super();

    this.nodeType = "default-poll-redirection";

    this.addPort(new DefaultPortModel(true, "input", "In"));
    this.poll = null;

    this.className = "PollRedirectionNodeModel";
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
    this.poll = object.poll;
  }

  serialize() {
    return _.merge(super.serialize(), {
      poll: this.poll,
    });
  }

  getInPort() {
    let inPorts = this.getInPorts();

    if (inPorts.length < 1) return;

    return inPorts[0];
  }

  getPoll() {
    return this.poll;
  }

  setPoll(poll) {
    this.poll = poll;
    super.update("poll-redirection", poll);
  }

  getAPISchema(nodeIDToAPIID) {
    if (!this.poll) {
      alert(language.pollRedirectionError);
      return;
    }

    return {
      id: nodeIDToAPIID(this.getID()),
      question_type: "POLL_REDIRECTION",
      text: `[${this.poll.id}]`,
      answers: [],
      visible_options: true,
      webhook_read: "",
      webhook_delivered: "",
    };
  }
}
