import { DefaultPortModel } from "DDCanvas/main";
import _ from "lodash";

export const ANSWER_PORT_TYPE_PROBABILITY = "PROBABILITY";

export class ProbabilityPortModel extends DefaultPortModel {
  constructor(probability) {
    super(false, "port-answer", "");
    this.probability = probability;
    this.className = "ProbabilityPortModel";
    this.answerType = ANSWER_PORT_TYPE_PROBABILITY;

    this.updateProbability = _.debounce(this.updateProbability, 1000);
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));
    super.deSerialize(object);
    this.probability = object.probability;
    this.answerType = object.answerType;
  }

  serialize() {
    return _.merge(super.serialize(), {
      probability: this.probability,
      answerType: this.answerType,
    });
  }

  getType() {
    return ANSWER_PORT_TYPE_PROBABILITY;
  }

  getIndex() {
    return this.getParent().getOrderedClosedPorts().indexOf(this) + 1;
  }

  getTargetNode() {
    const links = Object.values(this.getLinks());
    if (links.length == 0) return null;

    const link = links[0];
    const targetNode = link.getTargetPort()?.getParent();

    return targetNode;
  }

  getWebhook() {
    return this.webhook;
  }

  setWebhook(webhook) {
    this.webhook = webhook;
  }

  updateProbability(probability) {
    this.getParent().update("port-probability", probability);
  }

  setProbability(probability) {
    this.probability = probability;
    this.updateProbability(probability);
  }

  getAPISchema(nodeIDToAPIID) {
    let targetNode = this.getTargetNode();

    let nextNodeId = -1;
    if (targetNode) nextNodeId = nodeIDToAPIID(this.getTargetNode().getID());

    return {
      expected_text: this.probability.toString(),
      next_node_id: nextNodeId,
      webhook: this.webhook ? this.webhook : "",
      response: "",
      answer_type: ANSWER_PORT_TYPE_PROBABILITY,
      answer_subtype: "DEFAULT",
    };
  }
}
