import React, { Component } from "react";

import Textarea from "react-textarea-autosize";

import SelectDropdown from "Components/SelectDropdown";
import Switch from "Components/Switch";
import ImageTooltip from "./ImageTooltip";
import Toaster from "@bit/treble.components.toaster";
import timezones from "assets/timezones.json";
import newFeature from "assets/icons/newFeature.svg";
import SearchableDropdownV2 from "Components/SearchableDropdownV2";
import SelectDropdownV2 from "Components/SelectDropdownV2";
import TrebleIcon from "Components/TrebleIcon";
import CustomModal from "Components/CustomModal";

import {
  QuestionOpenNodeModel,
  QuestionClosedNodeModel,
  QuestionClosedButtonsNodeModel,
  QuestionClosedListNodeModel,
  ConditionalNodeModel,
  HSMNodeModel,
  AgentNodeModel,
  HubSpotAgentNodeModel,
  FreshdeskAgentNodeModel,
  ZendeskAgentNodeModel,
  KustomerAgentNodeModel,
  CustomAgentNodeModel,
  IntercomAgentNodeModel,
  PollRedirectionNodeModel,
  HelpdeskActionNodeModel,
  HelpdeskTicketNodeModel,
} from "views/Conversation/DDCustom/main";

import { AnswerPortWidgetTimeoutTextarea } from "./DDCustom/Widgets/AnswerPortComponent";
import {
  NO_MESSAGE_LIMIT,
  MESSAGE_LIMIT,
  SECONDS_TIMER,
  MINUTES_TIMER,
  VAR_ALL,
  VAR_TEXT,
  VAR_IMAGE,
  VAR_VIDEO,
  VAR_AUDIO,
  VAR_DOCUMENT,
  VAR_LOCATION,
  VAR_STICKER,
  VAR_EMAIL,
  VAR_NUMERIC,
  VAR_ZIPCODE,
  VAR_CONTACTS,
} from "./DDCustom/Models/QuestionNodeModel";
import events from "utils/events";
import "./style.scss";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";

const language = languages[getLanguage()];
const GOOGLE_SHEETS_URL = "docs.google.com/spreadsheets";

var assert = require("assert");
export default class ConfigurationPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: null,
      sheetsVariable: null,
      modal: null,
    };
  }

  renderHubspotNodeConfiguration = (node) => {
    let version = node.getVersion();

    let configurationContent = null;

    if (version === "V2") {
      assert(node.getAgentTag() != null);
      const renderAgentTag = () => {
        return (
          <SelectDropdown
            options={this.props.agentTags}
            display={(tag) => {
              return <b>{tag.name}</b>;
            }}
            onSelect={(tag) => {
              node.setAgentTag(tag.name);
              this.forceUpdate();
            }}
            noSelectionTitle={node.getAgentTag()}
          />
        );
      };

      configurationContent = (
        <>
          <div className="extra-configuration-header">
            <h2>{language.agentType}</h2>
          </div>
          {renderAgentTag()}
        </>
      );
    } else {
      configurationContent = (
        <>
          <div className="extra-configuration-header">
            <h2>{language.hubspotV1Deprecated}</h2>
          </div>
          <div className="deprecated">{language.hubspotV1DeprecatedD}</div>
        </>
      );
    }

    return (
      <div className="question-configuration-panel">
        {this.renderCloseButton()}
        <h1>{language.continueAgents.replace(/{{AGENTS}}/g, "HubSpot")}</h1>
        <div className="extra-configuration">{configurationContent}</div>
      </div>
    );
  };

  renderAgentNodeConfiguration = (node) => {
    assert(node.getAgentTag() != null);
    const renderAgentTag = () => {
      return (
        <SelectDropdown
          options={this.props.agentTags}
          display={(tag) => {
            return <b>{tag.name}</b>;
          }}
          onSelect={(tag) => {
            node.setAgentTag(tag.name);
            this.forceUpdate();
          }}
          noSelectionTitle={node.getAgentTag()}
        />
      );
    };

    let agentType =
      node instanceof HubSpotAgentNodeModel ? "HubSpot" : "agents.ai";

    return (
      <div className="question-configuration-panel">
        {this.renderCloseButton()}
        <h1>{language.continueAgents.replace(/{{AGENTS}}/g, agentType)}</h1>
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.agentType}</h2>
          </div>
          {renderAgentTag()}
        </div>
      </div>
    );
  };

  renderGeneralHelpdeskNodeConfiguration = (node) => {
    let integrationType;
    if (node instanceof FreshdeskAgentNodeModel) {
      integrationType = "Freshdesk";
    }

    const hasAgentEmail = node.getEmail() != null;
    if (!hasAgentEmail) return;

    const renderEmailInput = () => {
      return (
        <input
          value={node.getEmail()}
          onChange={({ target: { value } }) => {
            node.setEmail(value);
            this.forceUpdate();
          }}
          placeholder={"DEFAULT"}
          className="integration-input"
        />
      );
    };

    return (
      <div className="question-configuration-panel">
        {this.renderCloseButton()}
        <h1>
          {language.continueAgents.replace(/{{AGENTS}}/g, integrationType)}
        </h1>
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.hubspotReceiveEmail}</h2>
          </div>
          {renderEmailInput()}
        </div>
      </div>
    );
  };

  renderConditionalNodeConfiguration = (node, conversation) => {
    const renderVariableDropdown = (port) => {
      let nodeVariableValue = node.getVariableValue();

      if (port !== node.getOrderedClosedPorts()[0]) {
        return null;
      }

      let inputValue =
        node.getInputVariable() != null
          ? node.getInputVariable()
          : nodeVariableValue;

      // Retrieves model variables
      let modelVariables = this.props.modelVariables;

      // Set the first variable acording to the input value
      let dropdownOptions;

      // If the model variables include the input option then it should appear in the search
      if (modelVariables.includes(inputValue)) {
        dropdownOptions = [inputValue];
        // Else it must be a new variable that the user is trying to create and add
      } else {
        dropdownOptions = [{ newVar: inputValue }];
      }

      let displayValue;
      // If the input is null, the user has not typed anything, and there is a variable already then display it
      if (nodeVariableValue && inputValue == null) {
        displayValue = nodeVariableValue;
        // Else display the input of the user
      } else {
        displayValue = inputValue;
      }

      // Eliminate repeated variable values and filter according to input value
      let filteredOptions = modelVariables.filter((variable) =>
        variable.includes(inputValue)
      );
      // Concat the filtered options to have all the variables that contain the user input
      dropdownOptions = dropdownOptions.concat(filteredOptions);
      // Remove duplicates
      let setNotRepetedVariables = new Set(dropdownOptions);
      // Unpack set into array
      let notRepeatedVariables = [...setNotRepetedVariables];

      displayValue = "{{" + displayValue + "}}";

      return (
        <SelectDropdown
          options={notRepeatedVariables}
          display={(item) => {
            if (typeof item === "string" || item instanceof String)
              return "{{" + item + "}}";

            const { newVar } = item;
            return `${language.add} "{{${newVar}}}"...`;
          }}
          triggerComponent={
            <span className="input-dropdown">
              <input
                value={displayValue}
                onChange={({ target: { value } }) => {
                  value = value.replace(/{*}*/g, "");
                  node.setInputVariable(value);
                  this.forceUpdate();
                }}
                placeholder={language.input}
              />
              <span className="icon is-small">
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </span>
            </span>
          }
          onSelect={(item) => {
            // When selected an existing option
            if (typeof item === "string" || item instanceof String) {
              node.setInputVariable(item);
              node.setVariableValue(item);
              // When a new variable is created
            } else {
              node.setVariableValue(item.newVar);
            }
            this.props.forceUpdate();
          }}
        />
      );
    };

    const renderConditionDropdown = (port) => {
      let condition = port.getConditionObject();
      let conditionOptions = [
        { display: language.equals, value: "EQ" },
        { display: language.greater, value: "GT" },
        { display: language.less, value: "LT" },
        { display: language.greaterEqual, value: "GTEQ" },
        { display: language.lessEqual, value: "LTEQ" },
        { display: language.different, value: "DIFF" },
        { display: language.contains, value: "CONT" },
        { display: language.notContains, value: "NCONT" },
      ];
      return (
        <SelectDropdown
          options={conditionOptions}
          display={(item) => {
            return item.display;
          }}
          noSelectionTitle={condition["condition"]["display"]}
          onSelect={(item) => {
            port.setCondition(item);
            this.props.forceUpdate();
          }}
        />
      );
    };

    const renderValueTextarea = (port) => {
      let condition = port.getConditionObject();
      return (
        <div className="condition-value">
          <Textarea
            value={condition["value"]}
            onChange={({ target: { value } }) => {
              port.setConditionValue(value);
              this.props.forceUpdate();
            }}
          />
        </div>
      );
    };

    const renderValueSinceTimeTextarea = (port) => {
      let condition = port.getConditionObject();
      return (
        <div className="condition-value">
          <input
            type="time"
            value={condition["value"][0]}
            onChange={({ target: { value } }) => {
              port.setTimeSinceConditionValue(value);
              this.props.forceUpdate();
            }}
          />
        </div>
      );
    };

    const renderValueUntilTimeTextarea = (port) => {
      let condition = port.getConditionObject();
      return (
        <div className="condition-value">
          <input
            type="time"
            value={condition["value"][1]}
            onChange={({ target: { value } }) => {
              let diagramModel = this.props.diagramEngine.getDiagramModel();
              if (port.getConditionObject().value !== "BTW") {
                diagramModel.deactivateHistory();
                port.setCondition({ display: "between", value: "BTW" });
                diagramModel.activateHistory();
              }
              port.setTimeUntilConditionValue(value);
              this.props.forceUpdate();
            }}
          />
        </div>
      );
    };

    const renderAddNewCondition = (node) => {
      return (
        <div
          className="add-condition"
          onClick={() => {
            let diagramModel = this.props.diagramEngine.getDiagramModel();
            diagramModel.deactivateHistory();
            let ports = node.getOrderedClosedPorts();
            node.newClosedPortAfterPort(ports[ports.length - 1]);
            if (node.getConditionalType() == "TIME") {
              ports[ports.length - 1].setCondition({
                display: "between",
                value: "BTW",
              });
              ports[ports.length - 1].setConditionValue(
                ["00:00", "23:59"],
                false
              );
            }
            diagramModel.activateHistory();
            diagramModel.pushToHistory();
          }}
        >
          <span className="icon--plus closed-answer-icon"></span>{" "}
          {language.addCondition}
        </div>
      );
    };

    const renderDividers = (port) => {
      let conditionPorts = node.getOrderedClosedPorts();
      if (
        conditionPorts.length > 1 &&
        port !== conditionPorts[conditionPorts.length - 1]
      ) {
        return <hr />;
      }
    };

    const renderTimezone = (conversation) => {
      if (conversation.timezone) {
        let timezone = conversation.timezone;
        let timezoneValue = timezones.filter((tz) => tz.value === timezone)[0];
        return <div className="select-timezone">{timezoneValue.label}</div>;
      } else {
        return (
          <div className="select-timezone">
            <TrebleIcon name="big-settings" />
            <p>{language.selectTimezone}</p>
          </div>
        );
      }
    };

    const renderConditionTypeDropdown = (node) => {
      let conditionOptions = [
        {
          display: language.customCondition,
          value: "BTW",
          type: "CUSTOM",
        },
        {
          display: language.timeCondition,
          value: "CONT",
          type: "TIME",
        },
      ];

      let ports = node.getOrderedClosedPorts();

      return (
        <SelectDropdown
          options={conditionOptions}
          display={(item) => {
            return item.display;
          }}
          noSelectionTitle={
            node.getConditionalType() == "TIME"
              ? language.timeCondition
              : language.customCondition
          }
          onSelect={(item) => {
            let diagramModel = this.props.diagramEngine.getDiagramModel();
            diagramModel.deactivateHistory();
            node.setConditionalType(item.type);
            if (item.type == "TIME") {
              ports.map((port) => {
                port.setCondition({ display: language.between, value: "BTW" });
                port.setConditionValue(["00:00", "23:59"], false);
              });
            } else {
              node.setInputVariable("variable");
              ports.map((port) => {
                port.setCondition({
                  display: language.contains,
                  value: "CONT",
                });
                port.setConditionValue("value", false);
              });
            }
            diagramModel.activateHistory();
            diagramModel.pushToHistory();
          }}
        />
      );
    };

    let conditionPorts = node.getOrderedClosedPorts();
    let conditionType = node.getConditionalType();
    return (
      <div className="question-configuration-panel condition-node">
        {this.renderCloseButton()}
        <h1>{language.config}</h1>
        <div className="question-type">
          <h2>{language.questionType}</h2>
          <img src={newFeature} />
        </div>
        <div className="condition-type-dropdown">
          {renderConditionTypeDropdown(node)}
        </div>
        <h2>{language.stablishConditions}</h2>
        {conditionType === "TIME" && renderTimezone(conversation)}
        {/* Custom conditional node hadn't conditional_type before add diferents types of conditionals */}
        {(!conditionType || conditionType === "CUSTOM") &&
          conditionPorts.map((port) => {
            return (
              <div className="condition-panel">
                {renderVariableDropdown(port)}
                {renderConditionDropdown(port)}
                {renderValueTextarea(port)}
                {renderDividers(port)}
              </div>
            );
          })}
        {conditionType === "TIME" &&
          conditionPorts.map((port) => {
            return (
              <div className="condition-panel">
                <div className="time-range">
                  {renderValueSinceTimeTextarea(port)}
                  <p> {language.to} </p>
                  {renderValueUntilTimeTextarea(port)}
                </div>
                {renderDividers(port)}
              </div>
            );
          })}
        {renderAddNewCondition(node)}
      </div>
    );
  };

  renderGeneralNodeConfiguration = (node) => {
    const hasTimeoutPort = node.getNotAnswerTimeoutPort() != null;
    const hasSaveOnVariable = node.getSaveOnVariable() != null;
    const areHiddenClosedAnswers = node.getAreHiddenClosedAnswers();
    const hasWebhookSettings =
      node.getWebhookValues()["read"] !== null ||
      node.getWebhookValues()["delivered"] !== null;
    const hasMessageLimitAndTimer = node.hasMessageLimitAndTimer();

    /**
     * renderSaveOnVariable renders input dropdown acording to the variables available on
     * every node and also alows to create or set a new variable. The input and the value
     * of the variable are two separated items, in the sense that the variable in the node
     * only updates when an item has been selected by props.
     */
    const renderSaveOnVariable = () => {
      const renderSaveOnVariableConfiguration = () => {
        if (!hasSaveOnVariable) return;
        let nodeVariableValue = node.getSaveOnVariable();
        // Retrives model variables
        let modelVariables = this.props.modelVariables;
        // Set the fisrt variable acording to the input value
        let dropdownOptions;
        if (modelVariables.includes(nodeVariableValue)) {
          dropdownOptions = [nodeVariableValue];
        } else {
          dropdownOptions = [];
        }

        // Eliminate repeated variable values and filter according to input value
        let filteredOptions = modelVariables.filter((variable) =>
          variable.includes(nodeVariableValue)
        );
        dropdownOptions = dropdownOptions.concat(filteredOptions);
        let setNotRepetedVariables = new Set(dropdownOptions);
        let notRepeatedVariables = [...setNotRepetedVariables];

        let variableTypeOptions = [
          {
            display: language.allVarTypes,
            value: VAR_ALL,
          },
          {
            display: language.textVarType,
            value: VAR_TEXT,
          },
          {
            display: language.numericVarType,
            value: VAR_NUMERIC,
          },
          {
            display: language.imageVarType,
            value: VAR_IMAGE,
          },
          {
            display: language.emailVarType,
            value: VAR_EMAIL,
          },
          {
            display: language.documentVarType,
            value: VAR_DOCUMENT,
          },
          {
            display: language.videoVarType,
            value: VAR_VIDEO,
          },
          {
            display: language.locationVarType,
            value: VAR_LOCATION,
          },
          {
            display: language.zipcodeVarType,
            value: VAR_ZIPCODE,
          },
          {
            display: language.contactsVarType,
            value: VAR_CONTACTS,
          },
        ];

        // Tmp removes from dropdown
        // {
        //   display: language.audioVarType,
        //   value: VAR_AUDIO,
        // }
        // {
        //   display: language.locationVarType,
        //   value: VAR_LOCATION,
        // }
        // {
        //   display: language.stickerVarType,
        //   value: VAR_STICKER,
        // }

        const renderAllTypesConfiguration = () => {
          return (
            <div className="save-variable-configuration">
              <h2>{language.nameOfVariable}</h2>
              <SelectDropdown
                options={notRepeatedVariables}
                display={(item) => "{{" + item + "}}"}
                triggerComponent={
                  <div className="iconed-input">
                    <input
                      maxLength="100"
                      value={nodeVariableValue}
                      onChange={({ target: { value } }) => {
                        node.setSaveOnVariable(value);
                        this.forceUpdate();
                      }}
                      placeholder={language.input}
                    />
                    <span className="icon is-small">
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                    </span>
                  </div>
                }
                onSelect={(item) => {
                  // When selected an existing option
                  node.setSaveOnVariable(item);
                  this.forceUpdate();
                }}
              />
            </div>
          );
        };

        const renderVariableTypesConfiguration = () => {
          let typeValue = node.getSaveOnVariableType();
          return (
            <div className="save-variable-configuration">
              <h2>{language.typeOfVariable}</h2>
              <SelectDropdown
                options={variableTypeOptions}
                display={(opt) => opt.display}
                onSelect={(opt) => {
                  node.setSaveOnVariableType(opt);
                  this.props.forceUpdate();
                }}
                value={typeValue}
              />
              <h2>{language.nameOfVariable}</h2>
              <SelectDropdown
                options={notRepeatedVariables}
                display={(item) => "{{" + item + "}}"}
                triggerComponent={
                  <div className="iconed-input">
                    <input
                      maxLength="100"
                      value={nodeVariableValue}
                      onChange={({ target: { value } }) => {
                        node.setSaveOnVariable(value);
                        this.forceUpdate();
                      }}
                      placeholder={language.input}
                    />
                    <span className="icon is-small">
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                    </span>
                  </div>
                }
                onSelect={(item) => {
                  // When selected an existing option
                  node.setSaveOnVariable(item);
                  this.forceUpdate();
                }}
              />
            </div>
          );
        };

        if (
          node instanceof QuestionOpenNodeModel ||
          (node instanceof HSMNodeModel && node.hsm.type == "OPEN")
        ) {
          return renderVariableTypesConfiguration();
        } else {
          return renderAllTypesConfiguration();
        }
      };

      return (
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.variable}</h2>
            <ImageTooltip
              imageName="variable"
              title={language.variable}
              message={language.saveOnVariableDescription}
              itemtohover={
                <div className="icon icon--info size-16 clickable" />
              }
              placement="bottom"
            />
            <Switch
              active={hasSaveOnVariable}
              onChange={(status) => {
                if (status) {
                  node.setDefaultSaveOnVariable();
                } else {
                  node.resetSaveOnVariable();
                }
                this.forceUpdate();
              }}
            />
          </div>
          {renderSaveOnVariableConfiguration()}
        </div>
      );
    };

    const renderWebhookSettings = () => {
      if (!hasWebhookSettings) return;
      return (
        <div className="webhook-settings">
          <div className="iconed-input">
            <div className="title">
              <div className="webhook-icon" />
              <p style={{ width: 32 }}>{language.read}</p>
              <div className="vertical-line" />
            </div>
            <input
              type="text"
              value={node.getWebhookValues()["read"]}
              placeholder="https://example.com/hoo..."
              onChange={({ target: { value } }) => {
                node.setWebhookValue("read", value);
                this.forceUpdate();
              }}
            />
          </div>
          <div className="iconed-input">
            <div className="title">
              <div className="webhook-icon" />
              <p style={{ width: 67 }}>{language.deliver}</p>
              <div className="vertical-line" />
            </div>
            <input
              type="text"
              value={node.getWebhookValues()["delivered"]}
              placeholder="https://example.com/hoo..."
              onChange={({ target: { value } }) => {
                node.setWebhookValue("delivered", value);
                this.forceUpdate();
              }}
            />
          </div>
        </div>
      );
    };

    const renderTimeoutTextArea = () => {
      if (!hasTimeoutPort) return;

      const port = this.props.selectedNode.getNotAnswerTimeoutPort();

      return (
        <AnswerPortWidgetTimeoutTextarea
          node={this.props.selectedNode}
          port={port}
        />
      );
    };
    const renderQuestionType = () => {
      if (node instanceof QuestionOpenNodeModel)
        return language.openQuestionType;
      if (node instanceof QuestionClosedNodeModel)
        return language.closedQuestionType;
      if (node instanceof QuestionClosedButtonsNodeModel)
        return language.closedQuestionButtonsType;
      if (node instanceof QuestionClosedListNodeModel)
        return language.closedQuestionListType;
      if (node instanceof HSMNodeModel) return "HSM";
    };

    const renderHideAnswers = () => {
      if (node instanceof QuestionClosedNodeModel) {
        return (
          <div className="extra-configuration">
            <div className="extra-configuration-header">
              <h2>{language.hideOpt}</h2>
              <Switch
                active={areHiddenClosedAnswers}
                onChange={(status) => {
                  this.props.selectedNode.setAreHiddenClosedAnswers(status);
                  this.forceUpdate();
                }}
              />
            </div>
          </div>
        );
      } else {
        return;
      }
    };

    const renderMessageLimitAndTimer = () => {
      const renderTimerConfiguration = () => {
        let options = [
          {
            display: language.seconds,
            value: SECONDS_TIMER,
          },
          {
            display: language.minutes,
            value: MINUTES_TIMER,
          },
        ];
        return (
          <div className="timer-configuration">
            <div className="header">
              <h2>{language.timer}</h2>
              <ImageTooltip
                imageName="timer"
                title={language.timer}
                message={language.timerDescription}
                itemtohover={
                  <div className="icon icon--info size-16 clickable" />
                }
                placement="bottom"
              />
            </div>
            <div className="number-input">
              <input
                type="number"
                value={node.getTimerValue()}
                placeholder={10}
                min="1"
                onChange={({ target: { value } }) => {
                  node.setTimerValue(value);
                  this.forceUpdate();
                }}
              />
              <SelectDropdown
                options={options}
                display={(opt) => opt.display}
                onSelect={(opt) => {
                  node.setTimer(opt);
                  this.props.forceUpdate();
                }}
                value={node.getTimer()}
              />
            </div>
          </div>
        );
      };

      const renderMessageLimitConfiguration = () => {
        let options = [
          {
            display: language.noMessageLimit,
            value: NO_MESSAGE_LIMIT,
          },
          {
            display: language.exactNumber,
            value: MESSAGE_LIMIT,
          },
        ];

        const renderMessageLimitValueConfiguration = () => {
          if (node.getMessageLimit().value == NO_MESSAGE_LIMIT) {
            return;
          }
          return (
            <input
              type="number"
              value={node.getMessageLimitValue()}
              placeholder={2}
              min="2"
              onChange={({ target: { value } }) => {
                node.setMessageLimitValue(value);
                this.forceUpdate();
              }}
            />
          );
        };

        return (
          <div className="message-limit-configuration">
            <div className="header">
              <h2>{language.messageLimit}</h2>
              <ImageTooltip
                imageName="message_limit"
                title={language.messageLimit}
                message={language.messageLimitDescription}
                itemtohover={
                  <div className="icon icon--info size-16 clickable" />
                }
                placement="bottom"
              />
            </div>
            <SelectDropdown
              options={options}
              display={(opt) => opt.display}
              onSelect={(opt) => {
                node.setMessageLimit(opt);
                this.props.forceUpdate();
              }}
              value={node.getMessageLimit()}
            />
            {renderMessageLimitValueConfiguration()}
          </div>
        );
      };

      const renderLimitMessagesConfiguration = () => {
        if (!hasMessageLimitAndTimer) {
          return;
        } else {
          return (
            <div className="message-limit-timer-configuration">
              {renderMessageLimitConfiguration()}
              {renderTimerConfiguration()}
            </div>
          );
        }
      };

      if (node instanceof QuestionOpenNodeModel) {
        return (
          <div className="extra-configuration">
            <div className="extra-configuration-header">
              <h2>{language.limitMessagesAndTimer}</h2>
              <Switch
                active={hasMessageLimitAndTimer}
                onChange={(status) => {
                  if (status) {
                    node.setMessageLimitAndTimerDefault();
                  } else {
                    node.clearMessageLimitAndTimer();
                  }
                  this.forceUpdate();
                }}
              />
            </div>
            {renderLimitMessagesConfiguration()}
          </div>
        );
      } else {
        return;
      }
    };

    const renderAutoRetrySettings = () => {
      if (node instanceof HSMNodeModel) return;
      const renderAutoRetryConfiguration = () => {
        if (node.hasAutoRetry()) {
          return (
            <div className="auto-retry-configuration">
              <div className="auto-retry-item-configuration">
                <h2>{language.autoMsg}</h2>
                <input
                  value={node.getAutoRetryMessage()}
                  onChange={(e) => {
                    node.setAutoRetryAtribute("message", e.target.value);
                    this.forceUpdate();
                  }}
                  placeholder={language.autoMsgPA}
                />
              </div>
              <div className="auto-retry-item-configuration">
                <h2>{language.autoTime}</h2>
                <input
                  value={node.getAutoRetryTime()}
                  onChange={(e) => {
                    node.setAutoRetryAtribute("time", parseInt(e.target.value));
                    this.forceUpdate();
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          );
        }
      };
      return (
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.autoTitle}</h2>
            <Switch
              active={node.hasAutoRetry()}
              onChange={(status) => {
                if (status) {
                  node.setAutoRetry();
                  events.track("Toggle open to autoreply options", {});
                } else {
                  node.clearAutoRetry();
                  events.track("Toggle closed to autoreply options", {});
                }
                events.track("Toggle automatic reply option");
                this.forceUpdate();
              }}
            />
          </div>
          {renderAutoRetryConfiguration()}
        </div>
      );
    };

    const renderAnswersSettings = () => {
      if (
        node instanceof QuestionClosedNodeModel ||
        node instanceof QuestionClosedButtonsNodeModel ||
        node instanceof QuestionClosedListNodeModel ||
        (node instanceof HSMNodeModel && node.hsm.type == "CLOSED")
      ) {
        const renderAnswerOptoutWebhook = (answer) => {
          if (answer.answerSubtype == "OPTOUT") {
            return (
              <>
                <h2 className="custom">{language.optWeb}</h2>
                <input
                  value={answer.getOptoutWebhook()}
                  onChange={(e) => {
                    answer.setOptoutWebhook(e.target.value);
                    this.forceUpdate();
                  }}
                  placeholder="https://www.treble.ai/webhook/optout"
                />
              </>
            );
          } else {
            return;
          }
        };

        let ports = node.getOrderedClosedPorts();

        return (
          <div className="extra-configuration">
            <div className="answers-settings">
              <h2>{language.customAns}</h2>
              {ports.map((answer) => {
                return (
                  <div className="answer-setting" key={ports.indexOf(answer)}>
                    <div className="answer-main">
                      <p>{answer.label}</p>
                      <Switch
                        active={answer.answerSubtype == "OPTOUT" ? true : false}
                        onChange={(status) => {
                          if (status) {
                            events.track(
                              "Toggle open on answer optout options",
                              {}
                            );
                            answer.setAnswerSubtype("OPTOUT");
                            this.setState({
                              modal: { type: "optoutWarning" },
                            });
                          } else {
                            events.track(
                              "Toggle closed on answer optout options",
                              {}
                            );
                            answer.setAnswerSubtype("DEFAULT");
                          }
                          events.track("Toggle opt-out option");
                          this.forceUpdate();
                        }}
                      />
                    </div>
                    {renderAnswerOptoutWebhook(answer)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else {
        return;
      }
    };

    return (
      <div className="question-configuration-panel">
        {this.renderCloseButton()}
        <h1>{language.config}</h1>
        <h2>{language.questionType}</h2>
        <h3>{renderQuestionType()}</h3>
        <h2>{language.message}</h2>
        <Textarea
          value={node.getText()}
          onChange={({ target: { value } }) => {
            node.setText(value);
            this.forceUpdate();
          }}
        />
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.altFlux}</h2>
            <Switch
              active={hasTimeoutPort}
              onChange={(status) => {
                this.props.selectedNode.setHasNotAnswerTimeoutPort(status);
                this.forceUpdate();
              }}
            />
          </div>
          {renderTimeoutTextArea()}
        </div>
        {renderHideAnswers()}
        {renderMessageLimitAndTimer()}
        {renderSaveOnVariable()}
        {renderAnswersSettings()}
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>Webhooks</h2>
            <Switch
              active={hasWebhookSettings}
              onChange={(status) => {
                if (status) node.setInitialWebhookValues();
                else node.clearWebhookValues();
                this.forceUpdate();
              }}
            />
          </div>
          {renderWebhookSettings()}
        </div>
        {renderAutoRetrySettings()}
        {this.renderModal()}
      </div>
    );
  };
  getModalBody(type) {
    if (type == "optoutWarning") {
      return (
        <>
          <p className="bold">{language.optoutWarningTitle}</p>
          <p>{language.optoutWarningText}</p>
        </>
      );
    }
  }
  getModalButtons(type) {
    if (type == "optoutWarning") {
      return (
        <button
          onClick={() => {
            this.setState({ modal: null });
          }}
        >
          {language.optoutWarningButton}
        </button>
      );
    }
  }
  renderModal() {
    if (!this.state.modal) return;
    const type = this.state.modal.type;
    return (
      <CustomModal
        show={this.state.modal ? true : false}
        title={language[type + "header"]}
        onClose={() => {
          this.setState({ modal: null });
        }}
        body={this.getModalBody(type)}
        buttons={this.getModalButtons(type)}
        class={type}
      />
    );
  }
  renderConversationConfiguration = (conversation) => {
    const renderConversationName = () => {
      return (
        <div>
          <h2>{language.name}</h2>
          <Textarea
            value={conversation.name}
            onChange={({ target: { value } }) => {
              conversation.callback("name", value);
            }}
            onClick={() =>
              events.track("Rename conversation in Drag and drop settings")
            }
          />
        </div>
      );
    };

    const supportedLanguages = [
      { label: language.spanish, value: "ES" },
      { label: language.english, value: "EN" },
      { label: language.portuguese, value: "PT" },
      { label: language.french, value: "FR" },
      { label: language.italian, value: "IT" },
    ];

    const mapAbbreviationToComplete = {
      ES: language.spanish,
      EN: language.english,
      PT: language.portuguese,
      FR: language.french,
      IT: language.italian,
    };

    const renderConversationLanguage = () => {
      return (
        <div>
          <h2>{language.language}</h2>
          <SelectDropdownV2
            placeholder={mapAbbreviationToComplete[conversation.language]}
            options={supportedLanguages}
            optionHeight={35}
            listHeight={224}
            onSelect={(lang) => {
              this.props.trackEvent("select conversation language", {
                language: lang.value,
              });
              conversation.callback("language", lang.value);
            }}
            value={conversation.language}
          />
        </div>
      );
    };

    const renderConversationTimezone = () => {
      return (
        <div>
          <h2>{language.timezone}</h2>
          <SearchableDropdownV2
            placeholder={language.timezonePH}
            searchPlaceholder={language.timezoneSearch}
            options={timezones}
            searchBy={(tz) => tz.label}
            optionHeight={35}
            listHeight={224}
            onSelect={(tz) => {
              this.props.trackEvent("Select conversation timezone", {
                timezone: tz.value,
              });
              conversation.callback("timezone", tz.value);
            }}
            value={conversation.timezone}
          />
        </div>
      );
    };

    return (
      <div className="question-configuration-panel conversation">
        {this.renderCloseButton()}
        <h1>{language.configuration}</h1>
        {renderConversationName()}
        {renderConversationLanguage()}
        {renderConversationTimezone()}
      </div>
    );
  };

  checkAndShowToasterIfLinkIsGoogleSheet = (url) => {
    if (url.includes(GOOGLE_SHEETS_URL)) {
      Toaster({
        title: language.sheetsInclude,
        type: "success",
        closeButton: true,
      });
    }
  };

  renderIntegrationConfiguration = (conversation) => {
    const renderWebhookArea = () => {
      return (
        <div className="sheets-webhook-modal">
          <h2>{language.sheeturl}</h2>
          <Textarea
            placeholder="Ej: https://docs.google.com/spreadsheets/"
            value={conversation.googleSheetLink}
            onChange={({ target: { value } }) => {
              conversation.callback("googleSheet", value);
            }}
          />
          <h2>{language.sheetsVariable}</h2>
          <input
            value={this.props.conversation.googleSheetVariable}
            onChange={({ target: { value } }) => {
              if (
                this.props.conversation.googleSheetVariable === "" &&
                value !== ""
              ) {
                events.track("Modify Sheets Inbound Variable", {});
              }
              conversation.callback("googleSheetVariable", value);
            }}
            placeholder={language.sheetsVariablePH}
          />
          <p className="r">
            {language.intInfo}{" "}
            <a
              href="https://www.notion.so/treble/treble-ai-sheets-cd23d7e6b4114ae994e046207175089c"
              target="_blank"
              onClick={() =>
                events.track("Click on google sheets documentation")
              }
            >
              {language.clickHere}
            </a>
          </p>
        </div>
      );
    };

    return (
      <div className="question-configuration-panel conversation">
        {this.renderCloseButton({ conversation: conversation })}
        <h1>{language.googleTitle}</h1>
        <p className="r">{language.googleDes}</p>
        {renderWebhookArea()}
      </div>
    );
  };

  renderCloseButton = ({ conversation } = {}) => {
    return (
      <div
        className="button button-close"
        onClick={() => {
          this.props.closePanel();
          this.setState({});
          if (conversation) {
            this.checkAndShowToasterIfLinkIsGoogleSheet(
              conversation.googleSheetLink
            );
            conversation.callback("integration", null);
          }
        }}
      >
        <div className="icon icon--close-mask clickable" />
      </div>
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.selectedNode !== null && this.props.selectedNode == null) {
      this.setState({ searchValue: null });
    }
  };

  renderPollRedirectionNodeConfiguration = (node) => {
    const currentSearchValue = this.state.searchValue ?? "";
    const nodePoll = node.getPoll();

    const filteredPolls =
      currentSearchValue == ""
        ? this.props.polls
        : this.props.polls.filter((poll) => {
            if (
              poll.name
                .toLowerCase()
                .includes(currentSearchValue.toLowerCase()) ||
              poll.id.toString().includes(currentSearchValue.toLowerCase())
            ) {
              return poll;
            }
          });

    let inputValue = currentSearchValue;
    if (nodePoll !== null) {
      if (this.state.searchValue === null) {
        inputValue = `${nodePoll.id} - ${nodePoll.name}`;
      }
    }

    const triggerComponent = (
      <span className="input-dropdown">
        <div className="icon icon--search" />
        <input
          value={inputValue}
          onChange={({ target: { value } }) => {
            this.setState({ searchValue: value });
          }}
          placeholder={language.searchPoll}
        />
      </span>
    );

    const renderPolls = () => {
      return (
        <SelectDropdown
          options={filteredPolls}
          display={(poll) => (
            <div className="search-poll-dropdown-item">
              <p>
                {poll.id} - {poll.name}
              </p>
            </div>
          )}
          triggerComponent={triggerComponent}
          onSelect={(poll) => {
            node.setPoll(poll);
            this.props.forceUpdate();
            this.setState({ searchValue: null });
          }}
        />
      );
    };

    return (
      <div className="question-configuration-panel poll-redirection">
        {this.renderCloseButton()}
        <h1>{language.linkConversation}</h1>
        <p>{language.redirectPollD}</p>
        <div className="extra-configuration">
          <div className="extra-configuration-header">
            <h2>{language.selectPoll}</h2>
          </div>
          {renderPolls()}
        </div>
      </div>
    );
  };

  renderConfigurationPanel = (node, conversation) => {
    if (
      node instanceof KustomerAgentNodeModel ||
      node instanceof CustomAgentNodeModel ||
      node instanceof IntercomAgentNodeModel ||
      node instanceof ZendeskAgentNodeModel ||
      node instanceof FreshdeskAgentNodeModel ||
      node instanceof HelpdeskActionNodeModel ||
      node instanceof HelpdeskTicketNodeModel
    ) {
      return null;
    } else if (node instanceof HubSpotAgentNodeModel) {
      return this.renderHubspotNodeConfiguration(node);
    } else if (node instanceof AgentNodeModel) {
      return this.renderAgentNodeConfiguration(node);
    } else if (node instanceof ConditionalNodeModel) {
      return this.renderConditionalNodeConfiguration(node, conversation);
    } else if (node instanceof PollRedirectionNodeModel) {
      return this.renderPollRedirectionNodeConfiguration(node);
    } else if (conversation.integrationType && node == null) {
      return this.renderIntegrationConfiguration(conversation);
    } else if (conversation.open) {
      return this.renderConversationConfiguration(conversation);
    } else {
      return this.renderGeneralNodeConfiguration(node);
    }
  };

  render() {
    if (!this.props.selectedNode && !this.props.conversation.open) return <></>;
    const node = this.props.selectedNode;
    return this.renderConfigurationPanel(node, this.props.conversation);
  }
}
