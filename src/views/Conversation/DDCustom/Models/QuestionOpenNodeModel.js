import {
	AnswerPortModel,
	ANSWER_PORT_TYPE_OPEN,
	ANSWER_PORT_TYPE_CLOSED,
	ANSWER_PORT_TYPE_TIMEOUT,
} from "./AnswerPortModel";

import { QuestionNodeModel } from "./QuestionNodeModel";

export class QuestionOpenNodeModel extends QuestionNodeModel {
	constructor() {
		super();

		this.nodeType = "default-question-open";
		this.className = "QuestionOpenNodeModel";

		super.addPort(new AnswerPortModel("", ANSWER_PORT_TYPE_OPEN));
	}
}
