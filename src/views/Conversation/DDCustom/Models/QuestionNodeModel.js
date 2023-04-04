import _ from "lodash";

import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";

import {
  AnswerPortModel,
  ANSWER_PORT_TYPE_OPEN,
  ANSWER_PORT_TYPE_CLOSED,
  ANSWER_PORT_TYPE_TIMEOUT,
  ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
  ANSWER_PORT_TYPE_DEFAULT_CLOSED,
} from "./AnswerPortModel";
import languages from "./languages";
import configLanguages from "../../languages";
import getLanguage from "getLanguage.js";
import constants from "../../../../assets/constants";
import { OLD_CAMPAIGN_GOAL_LANGUAGES_TO_ENUM } from "./mappers";
import * as RJD from "DDCanvas/main";

const configLanguage = configLanguages[getLanguage()];

const DEFAULT_NOT_ANSWER_TIMEOUT_MINUTES = 15;

const VARIABLE_REGEX = /{{\w+}}/g;

export const QUESTION_TYPE_OPEN = "OPEN";
export const QUESTION_TYPE_CLOSED = "CLOSED";

export const SECONDS_TIMER = "SECONDS";
export const MINUTES_TIMER = "MINUTES";
export const DEFAULT_TIMER_VALUE = 10;

export const VAR_IMAGE = "IMAGE";
export const VAR_VIDEO = "VIDEO";
export const VAR_AUDIO = "AUDIO";
export const VAR_DOCUMENT = "DOCUMENT";
export const VAR_LOCATION = "LOCATION";
export const VAR_STICKER = "STICKER";
export const VAR_TEXT = "TEXT";
export const VAR_ALL = "ALL";
export const VAR_EMAIL = "EMAIL";
export const VAR_ZIPCODE = "ZIPCODE";
export const VAR_NUMERIC = "NUMERIC";
export const VAR_CONTACTS = "CONTACTS";

export const NO_MESSAGE_LIMIT = "NO_MESSAGE_LIMIT";
export const MESSAGE_LIMIT = "MESSAGE_LIMIT";
const DEFAULT_MESSAGE_LIMIT = 2;
export class QuestionNodeModel extends DefaultNodeModel {
  constructor(text = "") {
    super();

    this.nodeType = "default-question";
    this.className = "QuestionNodeModel";

    this.text = text;

    this.file = {
      url: "",
      type: "",
      variable: "",
    };

    this.webhookRead = null;
    this.webhookDelivered = null;

    this.areHiddenClosedAnswers = false;

    this.saveOnVariable = null;
    this.saveOnVariableType = null;

    this.messageLimit = null;
    this.messageLimitValue = null;

    this.timer = null;
    this.timerValue = null;

    this.location = {
      lat: null,
      lng: null,
      variable: "",
      address: "",
    };
    this.autoRetry = null;

    this.goalMeasurement = {
      campaignGoal: "",
      targetEvents: [],
    };

    super.addPort(new DefaultPortModel(true, "input", "In"));

    this.removePortNode = this.removePortNode.bind(this);
    this.getVariables = this.getVariables.bind(this);
    this.updateText = _.debounce(this.updateText, 1000);
  }

  deSerialize(object) {
    _.forEach(this.ports, (port) => this.removePort(port));

    super.deSerialize(object);
    this.webhookDelivered = object.webhook_delivered;
    this.webhookRead = object.webhook_read;
    this.text = object.text;
    this.areHiddenClosedAnswers = object.areHiddenClosedAnswers;
    this.saveOnVariable = object.saveOnVariable;

    if (object.saveOnVariable) {
      if (object.saveOnVariableType) {
        this.saveOnVariableType = object.saveOnVariableType;
      } else {
        this.saveOnVariableType = {
          display: configLanguage.allVarTypes,
          value: VAR_ALL,
        };
      }
    }

    if (object.timer) {
      this.timer = object.timer;
      this.timerValue = object.timerValue;
    }
    if (object.messageLimit) {
      this.messageLimit = object.messageLimit;
      this.messageLimitValue = object.messageLimitValue;
    }

    if (object.file) {
      this.file = {
        url: object.file.url,
        type: object.file.type,
        name: object.file.name,
        variable: object.file.variable ? object.file.variable : "",
      };
    }
    if (object.location) {
      this.location = {
        lat: object.location.lat,
        lng: object.location.lng,
        variable: object.location.variable,
        address: object.location.address,
      };
    }
    if (object.autoRetry) {
      this.autoRetry = object.autoRetry;
    }
    if (object.goalMeasurement) {
      this.goalMeasurement = object.goalMeasurement;
    } else if (object.linksTarget?.length > 1) {
      const oldCampaignGoal = object.linksTarget[0].campaign_goal;
      const campaignGoalEnum =
        OLD_CAMPAIGN_GOAL_LANGUAGES_TO_ENUM[oldCampaignGoal];
      this.goalMeasurement = {
        campaignGoal: campaignGoalEnum,
        targetEvents: object.linksTarget.map((target) => {
          return {
            type: constants.TARGET_EVENT_LINK,
            url: target.url,
            expectationValue: target.expectation_number,
          };
        }),
      };
    }
  }

  serialize() {
    return _.merge(super.serialize(), {
      webhook_read: this.webhookRead,
      webhook_delivered: this.webhookDelivered,
      text: this.text,
      file: this.file && {
        url: this.file.url,
        type: this.file.type,
        name: this.file.name,
        variable: this.file.variable,
      },
      location: this.location && {
        lat: this.location.lat,
        lng: this.location.lng,
        variable: this.location.variable,
        address: this.location.address,
      },
      areHiddenClosedAnswers: this.areHiddenClosedAnswers,

      saveOnVariable: this.saveOnVariable,
      saveOnVariableType: this.saveOnVariableType,

      messageLimit: this.messageLimit,
      messageLimitValue: this.messageLimitValue,

      timer: this.timer,
      timerValue: this.timerValue,
      autoRetry: this.autoRetry,

      goalMeasurement: this.goalMeasurement,
    });
  }

  getQuestionType() {
    if (this.getAnswerOpenPort()) return QUESTION_TYPE_OPEN;

    return QUESTION_TYPE_CLOSED;
  }

  hasMessageLimitAndTimer() {
    if (this.timer && this.messageLimit) {
      return true;
    } else {
      return false;
    }
  }

  getMessageLimit() {
    return this.messageLimit;
  }

  getMessageLimitValue() {
    return this.messageLimitValue;
  }

  getTimer() {
    return this.timer;
  }

  getTimerValue() {
    return this.timerValue;
  }

  getAnswerOpenPort() {
    const outPorts = this.getOutPorts();
    return outPorts.find((port) => port.answerType === ANSWER_PORT_TYPE_OPEN);
  }

  getAnswerClosedPorts() {
    const outPorts = Object.values(this.getOrderedClosedPorts()).filter(
      (port) => port.in == false
    );
    return outPorts.filter(
      (port) =>
        port.answerType === ANSWER_PORT_TYPE_CLOSED ||
        port.answerType == ANSWER_PORT_TYPE_CLOSED_CONTROLLED
    );
  }

  getAreHiddenClosedAnswers() {
    return this.areHiddenClosedAnswers;
  }

  getSaveOnVariable() {
    return this.saveOnVariable;
  }

  getSaveOnVariableType() {
    return this.saveOnVariableType;
  }

  setLocation(location, variable, address) {
    let tmpLocation = {
      lat: location.lat,
      lng: location.lng,
      variable: variable,
      address: address,
    };

    this.location = tmpLocation;
    super.update("location", tmpLocation);
  }

  setLocationCoordinates(lat, lng, address) {
    this.location.lat = lat;
    this.location.lng = lng;
    this.location.address = address;
  }

  setLocationAddress(address) {
    this.location.address = address;
  }

  setVariableFile(variable) {
    this.file.variable = variable;
    super.update("variable-file", variable);
  }

  getVariableFile() {
    return this.file.variable;
  }

  getVariables() {
    if (!this.text && !this.saveOnVariable) return [];

    const text_matches = this.text.match(VARIABLE_REGEX);
    const save_variable = this.saveOnVariable;

    if (!text_matches && !save_variable) return [];
    let variables = [];
    if (text_matches) {
      variables = text_matches
        .map((variable) => variable.slice(2, -2))
        .filter((variable) => Boolean(variable));
    }
    if (save_variable && save_variable !== "default") {
      variables.push(save_variable);
    }
    return variables;
  }

  getText() {
    return this.text;
  }

  updateText(text) {
    super.update("text", text);
  }

  setText(text) {
    this.text = text;
    this.updateText();
  }

  getWebhookValues() {
    return {
      read: this.webhookRead,
      delivered: this.webhookDelivered,
    };
  }

  setWebhookValue(key, value) {
    if (key === "read") {
      this.webhookRead = value;
    }
    if (key === "delivered") {
      this.webhookDelivered = value;
    }
  }

  setInitialWebhookValues() {
    this.webhookRead = "";
    this.webhookDelivered = "";
  }

  clearWebhookValues() {
    this.webhookRead = null;
    this.webhookDelivered = null;
  }

  setHasNotAnswerTimeoutPort(hasTimeoutport) {
    if (hasTimeoutport && !this.getNotAnswerTimeoutPort()) {
      this.addNotAnswerTimeoutPort();
    }

    if (!hasTimeoutport && this.getNotAnswerTimeoutPort()) {
      const port = this.getNotAnswerTimeoutPort();
      this.removePort(port);
    }
  }

  getNotAnswerTimeoutPort() {
    const port = Object.values(this.getPorts()).find(
      (elem) => elem.answerType == ANSWER_PORT_TYPE_TIMEOUT
    );
    return port;
  }

  getDefaultClosedAnswerPort() {
    const port = Object.values(this.getPorts()).find(
      (elem) => elem.answerType == ANSWER_PORT_TYPE_DEFAULT_CLOSED
    );
    return port;
  }

  getInPort() {
    return Object.values(this.getPorts()).find((elem) => elem.in);
  }

  hasAutoRetry() {
    if (this.autoRetry) {
      return true;
    }
    return false;
  }

  setAutoRetryAtribute(atribute, value) {
    let currentValues = this.autoRetry;
    currentValues[atribute] = value;
    this.autoRetry = currentValues;
  }
  setAutoRetry() {
    this.autoRetry = {};
  }
  clearAutoRetry() {
    this.autoRetry = null;
  }
  getAutoRetryMessage() {
    return this.autoRetry["message"] ? this.autoRetry["message"] : "";
  }
  getAutoRetryTime() {
    return this.autoRetry["time"] ? this.autoRetry["time"] : "";
  }

  isValidSchema() {
    // Prevent empty question
    if (
      this.text === "" &&
      !(this.file.url || this.file.variable) &&
      !((this.location.lat && this.location.lng) || this.location.variable)
    ) {
      return false;
    }

    if (this.goalMeasurement?.targetEvents) {
      const targetLinks = this.goalMeasurement.targetEvents.filter(
        (target) => target.type === constants.TARGET_EVENT_LINK
      );
      for (let i = 0; i < targetLinks.length; i++) {
        if (!this.text.includes(targetLinks[i].url)) return false;
      }
    }

    return true;
  }

  getAPISchema(nodeIDToAPIID) {
    if (!this.isValidSchema()) {
      return null;
    }

    let apiSchema = {
      id: nodeIDToAPIID(this.getID()),
      question_type: this.getQuestionType(),
      text: this.text,
      visible_options: !this.areHiddenClosedAnswers,
      webhook_read: this.webhookRead ? this.webhookRead : "",
      webhook_delivered: this.webhookDelivered ? this.webhookDelivered : "",
    };

    if (this.saveOnVariable && this.saveOnVariableType) {
      apiSchema["save_on_classified_on_key"] = this.saveOnVariable;
      let variableType = this.saveOnVariableType.value;
      if (variableType) {
        let subtypeVariables = [VAR_EMAIL, VAR_ZIPCODE, VAR_NUMERIC];
        if (subtypeVariables.includes(variableType)) {
          apiSchema["save_on_classified_type"] = VAR_TEXT;
          apiSchema["save_on_classified_subtype"] = variableType;
        } else {
          apiSchema["save_on_classified_type"] = variableType;
        }
      }
    }

    if (this.file) {
      if (this.file.url) {
        apiSchema["file_url"] = this.file.url;
        apiSchema["file_name"] = this.file.name;
      }
      if (this.file.variable) {
        apiSchema["file_url"] = `{{${this.file.variable}}}`;
      }
    }

    if (this.location) {
      if (this.location.lat && this.location.lng) {
        apiSchema["location"] = {
          latitude: this.location.lat,
          longitude: this.location.lng,
        };
      } else if (this.location.variable) {
        apiSchema["location"] = {
          variable: this.location.variable,
        };
      }
    }

    if (this.goalMeasurement.targetEvents.length > 0) {
      apiSchema["target_properties"] = {
        campaign_goal: this.goalMeasurement.campaignGoal,
        target_events: this.goalMeasurement.targetEvents.map((target) => {
          const targetEvent = {
            type: target.type,
          };
          if (target.type === constants.TARGET_EVENT_LINK) {
            targetEvent["url"] = target.url;
            targetEvent["expectation_number"] = target.expectationValue;
          }
          return targetEvent;
        }),
      };
    }

    // timeout
    const timeoutPort = this.getNotAnswerTimeoutPort();
    if (timeoutPort) {
      let targetNode = timeoutPort.getTargetNode();

      if (targetNode) {
        apiSchema["question_not_answer_timeout"] = {
          seconds: timeoutPort.getTimeout() * 60,
          to_question_id: nodeIDToAPIID(targetNode.getID()),
          webhook: timeoutPort.getWebhook(),
          seconds: timeoutPort.timeout * 60,
        };
      }
    }

    // answers
    if (this.getQuestionType() == QUESTION_TYPE_OPEN) {
      apiSchema["answers"] = [
        this.getAnswerOpenPort().getAPISchema(nodeIDToAPIID),
      ];
    } else {
      const answerSchemas = this.getAnswerClosedPorts().map((port) =>
        port.getAPISchema(nodeIDToAPIID)
      );
      if (answerSchemas.includes(null)) {
        return null;
      }
      // Default answer
      const defaultPort = this.getDefaultClosedAnswerPort();
      if (defaultPort) {
        answerSchemas.push(defaultPort.getAPISchema(nodeIDToAPIID));
      }
      apiSchema["answers"] = answerSchemas;
      apiSchema["question_subtype"] = this.getClosedType();
    }

    if (this.getQuestionType())
      if (this.messageLimit) {
        if (this.messageLimit.value == MESSAGE_LIMIT) {
          apiSchema["message_limit"] = this.messageLimitValue;
        }
      }

    if (this.timer) {
      let value = this.timerValue;
      if (this.timer.value == MINUTES_TIMER) {
        value = value * 60;
      }
      apiSchema["timer"] = value;
    }

    if (this.autoRetry) {
      let seconds = this.autoRetry["time"];
      seconds = seconds * 60;
      apiSchema["auto_retry"] = {
        time: seconds,
        message: this.autoRetry["message"],
      };
    }

    return apiSchema;
  }

  setAreHiddenClosedAnswers(areHiddenClosedAnswers) {
    this.areHiddenClosedAnswers = areHiddenClosedAnswers;
  }

  setMessageLimit(messageLimit) {
    this.messageLimit = messageLimit;
  }

  setMessageLimitValue(messageLimitValue) {
    this.messageLimitValue = messageLimitValue;
  }

  setTimer(timer) {
    this.timer = timer;
  }

  setTimerValue(timerValue) {
    this.timerValue = timerValue;
  }

  setSaveOnVariable(variable) {
    this.saveOnVariable = variable;
  }

  setSaveOnVariableType(type) {
    this.saveOnVariableType = type;
  }

  setMessageLimitAndTimerDefault() {
    this.messageLimit = {
      display: configLanguage.noMessageLimit,
      value: NO_MESSAGE_LIMIT,
    };
    this.messageLimitValue = DEFAULT_MESSAGE_LIMIT;
    this.timerValue = DEFAULT_TIMER_VALUE;
    this.timer = {
      display: configLanguage.seconds,
      value: SECONDS_TIMER,
    };
  }

  clearMessageLimitAndTimer() {
    this.messageLimit = null;
    this.messageLimitValue = null;
    this.timer = null;
    this.timerValue = null;
  }

  setDefaultSaveOnVariable() {
    this.saveOnVariable = "";
    this.saveOnVariableType = {
      display: configLanguage.allVarTypes,
      value: VAR_ALL,
    };
  }

  resetSaveOnVariable() {
    this.saveOnVariable = null;
    this.saveOnVariableType = null;
  }

  addNotAnswerTimeoutPort() {
    if (this.getNotAnswerTimeoutPort()) return;

    this.addPort(new AnswerPortModel("", ANSWER_PORT_TYPE_TIMEOUT));
  }

  addDefaultClosedAnswerPort() {
    if (this.getDefaultClosedAnswerPort()) return;
    this.addPort(
      new AnswerPortModel("DEFAULT", ANSWER_PORT_TYPE_DEFAULT_CLOSED)
    );
  }

  addAnswerClosedPort() {
    this.addPort(new AnswerPortModel(""));

    // A Question can have either an open answer or closed answers
    let answerOpenPort = this.getAnswerOpenPort();
    if (answerOpenPort) this.removePort(answerOpenPort);
  }

  removePortNode(port) {
    this.removePort(port);

    if (port.name === "not-answer-timeout") return;

    // check if last remove is an out port and add OPEN if no more
    const ports = Object.values(this.ports);
    const filtered = ports.filter((elem) => elem.name.indexOf("port") !== -1);

    if (filtered.length == 0) {
      this.addPort(new RJD.DefaultPortModel(false, "open", "ABIERTA"));
    }
  }

  removeAnswerClosedPort(port) {
    super.removePort(port);

    const outPorts = this.getOutPorts();

    if (outPorts.length > 0) return;

    super.addPort(new AnswerPortModel("", ANSWER_PORT_TYPE_OPEN));
  }

  addMedia(url, type, filename) {
    let tmpFile = {
      url: url,
      type: type,
      name: filename,
    };
    this.file = tmpFile;
    super.update("file", tmpFile);
  }

  getMediaUrl() {
    return this.file.url;
  }

  getMediaType() {
    return this.file.type;
  }

  getMediaFilename() {
    return this.file.name;
  }

  getGoalMeasurement() {
    return this.goalMeasurement;
  }

  updateGoalMeasurement(goalMeasurement) {
    this.goalMeasurement = goalMeasurement;
    super.update("goal-measurement", goalMeasurement);
  }

  getLocation() {
    if (!this.location.address && !this.location.variable) return null;
    return this.location;
  }

  deleteMedia() {
    this.file = {
      url: "",
      type: "",
      name: "",
      variable: "",
    };
    super.update("delete-media", null);
  }

  deleteLocation() {
    let update = false;
    let tmpLocation = {
      lat: null,
      lng: null,
      variable: "",
      address: "",
    };
    if (this.location.variable || (this.location.lat && this.location.lng)) {
      update = true;
    }

    this.location = tmpLocation;
    if (update) {
      super.update("location", tmpLocation);
    }
  }
}
