import { AbstractInstanceFactory } from "DDCanvas/main";

import { AnswerPortModel } from "../Models/AnswerPortModel";
import { ProbabilityPortModel } from "../Models/ProbabilityPortModel";

export class AnswerPortFactory extends AbstractInstanceFactory {
  constructor() {
    super("AnswerPortModel");
  }

  getInstance() {
    return new AnswerPortModel();
  }
}

export class ProbabilityPortFactory extends AbstractInstanceFactory {
  constructor() {
    super("ProbabilityPortModel");
  }

  getInstance() {
    return new ProbabilityPortModel();
  }
}
