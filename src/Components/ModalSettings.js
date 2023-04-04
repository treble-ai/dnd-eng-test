import React from "react";
import Textarea from "react-textarea-autosize";
import Modal from "@bit/treble.components.modal";
import Toaster from "@bit/treble.components.toaster";
import { Radio } from "antd";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ReactInputVerificationCode from "react-input-verification-code";
import moment from "moment";
import Countdown, { zeroPad } from "react-countdown";

import events from "utils/events";
import SelectDropdown from "Components/SelectDropdown";
import CountryDropdown from "Components/CountryDropdown";
import TextInput from "Components/TextInput";
import CustomModal from "Components/CustomModal";
import iconZendeskImage from "views/Conversation/images/IconZendesk.svg";
import languages from "views/Settings/languages";
import getLanguage from "getLanguage.js";
import constants from "assets/constants";
import * as Countries from "utils/Countries";

import {
  conversationConfig,
  conversationLanguages,
  membersOptions,
  nullTypes,
  usersInfo,
  maxTriesOptions,
  agentRedirectionOptions,
  timeLimitByCount,
} from "views/Settings/mappers";

import "./styles.scss";

const language = languages[getLanguage()];

const ModalSettings = (props) => {
  const conversationsOptions = (type) => {
    let body = (
      <div className="automated-messages-body" id="automated-messages-modal">
        <h6>{language[type + "modalTitle"]}</h6>
        <p className="tr">{language[type + "modalText"]}</p>
        <SelectDropdown
          options={conversationLanguages}
          display={(item) => {
            return language[item];
          }}
          triggerComponent={
            <div className="lang-selection">
              <p>
                {props.modalSelectedLanguage != ""
                  ? language[props.modalSelectedLanguage]
                  : language.nolangSelected}
              </p>
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </div>
          }
          onSelect={(option) => {
            props.handleInputModal("modalSelectedLanguage", option);
          }}
        />
        <Textarea
          value={props.modalMessage}
          name={"modalMessage"}
          placeholder={language.writeMsg}
          onChange={(e) => {
            props.handleInputModal(e.target.name, e.target.value);
          }}
        />
      </div>
    );
    let buttons = [
      {
        onClick: props.sendConvMessages,
        body: language.save,
      },
    ];
    if (nullTypes.includes(type)) {
      buttons.unshift({
        onClick: () => {
          props.sendConvMessages(true);
        },
        body: language.noMesgSend,
      });
    }
    return [body, buttons, language.automatedMessage];
  };
  const channelOptions = () => {
    let currentChannel = Object.assign({}, props.modalSelectedChannel);
    let currentSearchValue = props.modalSearchValue ?? "";

    let filteredPolls =
      currentSearchValue == ""
        ? props.polls
        : props.polls.filter((poll) => {
            if (
              poll.name
                .toLowerCase()
                .includes(currentSearchValue.toLowerCase()) ||
              poll.id.toString().includes(currentSearchValue.toLowerCase())
            ) {
              return poll;
            }
          });
    let noneItem = filteredPolls.find((e) => e.id === -1);
    if (!noneItem) {
      filteredPolls.unshift({ name: language.searchPoll, id: -1 });
    }
    let inputValue = currentSearchValue;
    if (currentChannel.inbound_poll.name && props.modalSelectedPoll == null) {
      if (props.modalSearchValue === null) {
        inputValue = currentChannel.inbound_poll.name;
      }
    } else if (
      props.modalSelectedPoll != null &&
      props.modalSearchValue === null
    ) {
      inputValue = props.modalSelectedPoll.name;
    }

    const triggerComponent = (
      <span
        className="input-dropdown"
        onClick={(e) => {
          props.handleToggle();
        }}
      >
        <input
          value={inputValue}
          onChange={({ target: { value } }) => {
            props.handleInputModal("modalSearchValue", value);
          }}
          placeholder={language.searchPoll}
        />
      </span>
    );
    let body = (
      <div
        className={`channel-settings-body ${props.toggle && "active"}`}
        id="channel-settings-body"
      >
        <h6>{language.internName}</h6>
        <p className="tr">{language.channelText}</p>
        <input
          value={currentChannel.name}
          onChange={(e) => {
            currentChannel["name"] = e.target.value;
            props.handleInputModal("modalSelectedChannel", currentChannel);
          }}
          placeholder={language.noName}
        />
        <h6>{language.inboundConv}</h6>
        <SelectDropdown
          options={filteredPolls}
          display={(poll) => (
            <div className="search-poll-dropdown-item">
              <p>{poll.name}</p>
            </div>
          )}
          triggerComponent={triggerComponent}
          onSelect={(poll) => {
            props.handleInputModal("modalSelectedPoll", poll);
            props.handleInputModal("modalSearchValue", null);
            props.handleToggle(false);
          }}
          hideOnClickOutside={false}
        />
      </div>
    );
    let buttons = [
      {
        onClick: props.sendChannelUpdate,
        body: language.save,
      },
    ];
    return [body, buttons, props.getNumberDisplay(currentChannel.number)];
  };
  const newMemberOptions = () => {
    let newUser = props.modalUser;
    let body = (
      <div className="new-user-modal" id="new-user-modal">
        <h6>{language.permits}</h6>
        <SelectDropdown
          options={membersOptions.filter((option) => option != "DELETED")}
          display={(option) => {
            return <p className="l">{language[option]}</p>;
          }}
          triggerComponent={
            <>
              <div className="role-dropdown">
                <p className="l">
                  {newUser.role ? language[newUser.role] : language.none}
                </p>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              {props.renderAlert("role")}
            </>
          }
          onSelect={(option) => {
            newUser["role"] = option;
            props.updateAlerts("role");
            props.handleInputModal("modalUser", newUser);
          }}
        />
        {usersInfo.map((e) => {
          let type = e == "password" ? "password" : "text";
          if (e == "role") return;
          return (
            <>
              <h6>{language[e]}</h6>
              <input
                type={type}
                onChange={(event) => {
                  newUser[e] = event.target.value;
                  props.updateAlerts(e);
                  props.handleInputModal("modalUser", newUser);
                }}
                value={newUser[e] ? newUser[e] : ""}
                placeholder={language[e + "pa"]}
              />
              {props.renderAlert(e)}
            </>
          );
        })}
      </div>
    );
    let buttons = [
      {
        onClick: props.createUser,
        body: language.save,
      },
    ];
    return [body, buttons, language.createUser];
  };
  const hubspotInstallationOptions = () => {
    let body = (
      <div
        className="hubspot-installation-modal"
        id="hubspot-installation-modal"
      >
        <p className="installation-info">{language.hubspot_installationInfo}</p>
        <h6 className="installation-step-one">
          {language.hubspot_installationStepOne}
        </h6>
        <a className="install-button" href={constants.HUBSPOT_INSTALL_LINK}>
          <div className="icon--HUBSPOT"></div>
          <p>{language.hubspot_installationStepOneButton}</p>
        </a>
        <h6 className="installation-step-two">
          {language.hubspot_installationStepTwo}
        </h6>
        <Radio.Group
          onChange={(e) => {
            props.handleInputModal("hubspotPhoneProperty", e.target.value);
          }}
          value={props.hubspotPhoneProperty}
        >
          <Radio value={"phone"}>Phone</Radio>
          <Radio value={"mobilephone"}>Mobilephone</Radio>
          {props.renderAlertError(
            props.hubspotPhoneProperty,
            props.validateHubspot
          )}
        </Radio.Group>
        <h6 className="step-three">{language.hubspot_installationStepThree}</h6>
        <input
          onChange={(event) => {
            props.handleInputModal("hubspotCompanyId", event.target.value);
          }}
          value={props.hubspotCompanyId}
          placeholder="e.g 1234567"
        />
        {props.renderAlertError(props.hubspotCompanyId, props.validateHubspot)}
        <h6 className="installation-step-four">
          {language.hubspot_installationStepFour}
        </h6>
        <p className="email-info">{language.hubspot_installationEmailInfo}</p>
        <input
          onChange={(event) => {
            props.handleInputModal("hubspotEmail", event.target.value);
          }}
          value={props.hubspotEmail}
          placeholder="e.g treble@treble.ai"
        />
        {props.renderAlertError(
          props.hubspotEmail,
          props.validateHubspot,
          "email"
        )}
      </div>
    );
    let buttons = [
      {
        onClick: props.createHubspotIntegration,
        body: language.hubspot_installationConnectButton,
      },
    ];
    return [body, buttons, language.hubspot_installationTitle];
  };
  const hubspotInformationOptions = () => {
    let integration = props.showIntegration;
    let body = (
      <div
        className="helpdesk-information-modal"
        id="hubspot-information-modal"
      >
        <p className="info">{language.hubspot_informationInfo}</p>
        <a href={constants.TREBLE_APP_CHROME_STORE} target="_blank">
          Extensión de Chrome
          <div className="icon--external-link"></div>
        </a>
        <p className="extension-info">
          {language.hubspot_informationExtensionInfo}
        </p>
        <div className="copy-key">
          <input readOnly={true} value={integration?.settings.access_code} />
          <button
            onClick={() => {
              navigator.clipboard.writeText(integration?.settings.access_code);
              Toaster({
                title: language.succesfully_copied,
                type: "success",
                closeButton: true,
              });
            }}
          >
            {language.hubspot_informationCopy}
          </button>
        </div>
      </div>
    );
    let buttons = [];
    return [body, buttons, "Hubspot"];
  };
  const zendeskInstalationOptions = (resetState) => {
    let body = (
      <div id="modal-for-helpdesk-integrations">
        <div>
          <p>{language.zendesk_installationInfo}</p>
        </div>
        <div className="modal-integration-text">
          <p>
            {"1. "}
            {language.helpdeskHost}
            <a target="_blank" href={constants.ZENDESK_COMPANY_DOMAIN}>
              <div className="icon icon--help-circle" />
            </a>
          </p>
        </div>
        <div className="field">
          <div className="control">
            <TextInput
              className="input"
              placeholder={`trebleai`}
              type="text"
              onChange={(e) => {
                props.handleInputModal("helpdeskHost", e.target.value);
              }}
              value={props.helpdeskHost}
            />
          </div>
        </div>
        {props.renderAlertError(props.helpdeskHost, props.validateZendesk)}
        <div className="modal-integration-text">
          <p>
            {"2. "}
            {language.zendeskAdminAccess}
          </p>
          <a
            href={
              `https://${props.helpdeskHost}.zendesk.com/oauth/authorizations/new` +
              "?response_type=code" +
              `&redirect_uri=${MAIN_URL}/auth/oauth/zendesk` +
              "&client_id=zdg-trebleai-global-identifier" +
              "&scope=read%20write" +
              `&state=${props.helpdeskHost}`
            }
            target="_blank"
          >
            <button
              className="zendesk"
              onClick={() => {
                this.setState({ validateHelpdesk: true });
              }}
            >
              <img src={iconZendeskImage} />
              <p>{language.allowAccess}</p>
            </button>
          </a>
        </div>
        <div className="modal-integration-text">
          <p>
            {"3. "}
            {language.installZendeskApp}
          </p>
          <p className="description">{language.installZendeskApiKeyHelp}</p>
          <a href={constants.TREBLE_APP_ZENDESK_STORE} target="_blank">
            <button className="zendesk">
              <img src={iconZendeskImage} />
              <p>{language.installHere}</p>
            </button>
          </a>
        </div>
      </div>
    );
    let buttons = [
      {
        onClick: () => {
          events.track("Dismiss connect with human integration");
          resetState();
        },
        body: language.cancel,
      },
      {
        body: language.connect,
        color: "treble",
        onClick: () => {
          props.createZendeskIntegration(props.helpdeskHost);
        },
      },
    ];
    return [body, buttons, language.zendesk_installationTitle];
  };
  const zendeskInformationOptions = () => {
    let body = (
      <div
        className="helpdesk-information-modal"
        id="zendesk-information-modal"
      >
        <p className="info">{language.zendesk_informationInfo}</p>
        <a href={constants.TREBLE_APP_ZENDESK_STORE} target="_blank">
          Treble App
          <div className="icon--external-link"></div>
        </a>
        <p className="extension-info">
          {language.zendesk_informationExtensionInfo}
        </p>
        <div className="copy-key">
          <input readOnly={true} value={props.general.api_key} />
          <button
            onClick={() => {
              navigator.clipboard.writeText(props.general.api_key);
              Toaster({
                title: language.succesfully_copied,
                type: "success",
                closeButton: true,
              });
            }}
          >
            {language.zendesk_informationCopy}
          </button>
        </div>
      </div>
    );
    let buttons = [];
    return [body, buttons, "Zendesk"];
  };
  const agentRedirectionOpt = () => {
    let currentAgentOptions = Object.assign(
      {},
      props.general.agent_default_redirection
    );
    let currentOptions = Object.assign({}, props.agentRedirection);
    let body = (
      <div className="agent-redirection-modal" id="agent-redirection-modal">
        {agentRedirectionOptions.map((option) => {
          let display = currentOptions[option];
          if (!display && currentAgentOptions[option]) {
            display = currentAgentOptions[option];
          }
          if (display && display % 1 === 0) {
            display = language["option" + display];
          }
          return (
            <div className="agent-redirection-option">
              <div className="redirection-information">
                <p className="bold">{language[option + "title"]}</p>
                <p>{language[option + "text"]}</p>
              </div>
              <div className="redierction-dropdown">
                <SelectDropdown
                  options={option == "tag" ? props.agentTags : maxTriesOptions}
                  display={(e) => {
                    return (
                      <div className="option-item">
                        <p>{e.name ? e.name : language["option" + e]}</p>
                        <div
                          className={`icon icon--black-check ${
                            (e.name == display && display) ||
                            (language["option" + e] == display && display)
                              ? "is-active"
                              : ""
                          }`}
                        />
                      </div>
                    );
                  }}
                  triggerComponent={
                    <>
                      <p>{language[option + "dpTitle"]}</p>
                      <div className="agent-redirection-dropdown">
                        <p className={`${display ? "" : "no-selected"}`}>
                          {display ? display : language.selectOneOption}
                        </p>
                        <div className="icon icon--down-arrow" />
                      </div>
                    </>
                  }
                  onSelect={(e) => {
                    currentOptions[option] = e.name ? e.name : e;
                    props.handleInputModal("agentRedirection", currentOptions);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );

    let buttons = (
      <div className="modal-buttons">
        <button onClick={props.onClose}>{language.cancel}</button>
        <button
          className="purple"
          onClick={(e) => {
            let data = props.agentRedirection;
            let currentData = props.general.agent_default_redirection;
            let body = {};

            body["tag"] = data.tag ? data.tag : currentData.tag;
            body["max_tries"] = data.max_tries
              ? data.max_tries
              : currentData.max_tries;
            if (body.tag && body.max_tries) {
              props.updateSettings({
                key: "agent_default_redirection",
                value: body,
              });
            }
          }}
        >
          {language.saveConfig}
        </button>
      </div>
    );
    return [body, buttons, language.agentRedirectionTitle, "agent-redirection"];
  };
  const addNewNumeberOptions = () => {
    const renderNumber = (numberObj) => {
      return (
        <div className="number-display">
          <p>
            {numberObj.verified_name
              ? numberObj.verified_name
              : language.noDisplay}
          </p>
          <div className="number-and-status">
            <p>{numberObj.display_phone_number}</p>
            <div
              className={`number-label ${numberObj.code_verification_status}`}
            >
              <p>{numberObj.status}</p>
            </div>
          </div>
        </div>
      );
    };
    let number = props.newNumber;
    const renderTooltip = () => {
      return (
        <Tooltip id="add-number-tooltip" className="add-number-tooltip">
          <p>{language.noPhone}</p>
        </Tooltip>
      );
    };
    const body = (
      <div className="add-number-modal-body">
        <h5>{language.addPhoneNumber}</h5>
        <p className="bold">{language[props.modalState + "text"]}</p>
        <div className="dotted-space" />
        {props.modalState == "addNumberToWaba" ? (
          <div className="new-waba">
            <p>{language.displayNumber}</p>
            <input
              type="text"
              placeholder="Ej. YX Corp"
              value={number?.display}
              onChange={(e) => {
                number["display"] = e.target.value;
                props.changeState("newNumber", number);
              }}
            />
            <p>{language.phoneNumber}</p>
            <div className="number-selector">
              <CountryDropdown
                onSelect={(item) => {
                  number["country_index"] = item;
                  props.changeState("newNumber", number);
                }}
                currentCountry={number.country_index}
              />
              <input
                onChange={(e) => {
                  number["cellphone"] = e.target.value;
                  props.changeState("newNumber", number);
                }}
                value={number?.cellphone ? number?.cellphone : ""}
                type="text"
                className="cellphone-input "
                placeholder="000-000-0000"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="icon-and-text">
              <OverlayTrigger
                placement={"right"}
                delay={{ show: 50, hide: 400 }}
                overlay={renderTooltip()}
                overlayOpen={false}
              >
                <div className="icon icon--information" />
              </OverlayTrigger>

              <p>{language.selectNumber}</p>
            </div>
            <SelectDropdown
              options={props.availableNumbers.filter(
                (number) =>
                  !props.wabaLines
                    .map((line) => line.phone_number_info.id)
                    .includes(number.id)
              )}
              display={(item) => {
                if (number?.id != item.id) return renderNumber(item);
                return (
                  <div className="selected-number">
                    {renderNumber(item)}
                    <div className="icon icon--check" />
                  </div>
                );
              }}
              triggerComponent={
                <button>
                  {number?.id ? (
                    renderNumber(number)
                  ) : (
                    <p className="no-select">{language.select}</p>
                  )}
                  <div className="icon icon--down-arrow" />
                </button>
              }
              onSelect={(item) => {
                props.changeState("newNumber", item);
              }}
              className={"select-bsp-number"}
            />
          </>
        )}
      </div>
    );

    const buttons = (
      <div className="add-number-modal-buttons">
        <button
          className="purple"
          onClick={() => {
            let body;
            if (props.modalState == "addNumberToWaba") {
              body = {
                country_code: Countries[number.country_index].phone,
                cellphone: number.cellphone,
                display: number.display,
              };
            } else {
              body = {
                phone_number_id: number.id,
              };
            }
            props.addNewNumber(body, () => {
              props.onClose();
              props.getWabaLines();
            });
          }}
        >
          {language.addNumber}
        </button>
        <button
          className="transparent"
          onClick={() => {
            props.modalState == "addNumberToWaba"
              ? props.changeState("modalState", "selectExistingPhone")
              : props.onClose();
            props.changeState("newNumber", {});
          }}
        >
          {language.goBack}
        </button>
      </div>
    );
    return [body, buttons, "", "add-number-modal"];
  };
  const getVerificationCodeCounter = (number) => {
    const count = number.phone_number_info.verification_code_count;
    const timestamp = number.phone_number_info.verification_code_timestamp;
    const dateObject = moment
      .utc(timestamp * 1000)
      .add(timeLimitByCount[count] ? timeLimitByCount[count] : 10, "minutes");
    const now = moment.utc();
    if (count > 0 && timestamp > 0 && dateObject.diff(now) > 0) {
      return (
        <div className="verification-count-container">
          <p>{language.verificationCount.replace("{{X}}", count)}</p>
          <Countdown
            date={dateObject}
            renderer={({ hours, minutes, seconds }) => {
              return (
                <div className="countdown-container">
                  <p className="red">{language.tryAgainIn}</p>
                  <span>
                    {hours != 0 && zeroPad(hours) + ":"}
                    {zeroPad(minutes)}:{zeroPad(seconds)}
                  </span>
                  <p className="red">
                    {hours == 0 ? language.minutes : language.hours}
                  </p>
                </div>
              );
            }}
            onComplete={() => {
              props.changeState("modalState", "sendCode");
            }}
          />
        </div>
      );
    }
  };
  const verifyNumberOptions = () => {
    let number = props.newNumber;
    const getBody = () => {
      if (props.modalState == "sendCode") {
        return (
          <div className="send-code">
            <div className="number-container">
              <p>{number.phone_number_info.display_phone_number}</p>
            </div>
            <div className="dotted-space" />
            <p className="middle">{language.pickMethod}</p>
            <div className="method-container">
              {["sms", "voice"].map((option) => {
                return (
                  <button
                    className={`${option} ${
                      number.method == option ? "selected" : ""
                    }`}
                    onClick={() => {
                      number["method"] = option;
                      props.changeState("newNumber", number);
                    }}
                    key={option}
                  >
                    {language[option]}
                  </button>
                );
              })}
            </div>
            <p className="red">{language.metaSendCodeDisclaimer}</p>
          </div>
        );
      } else if (props.modalState == "loading") {
        return (
          <div className="loading">
            <div className="image image--loading" />
            <p>{language.loadingMessage}</p>
          </div>
        );
      } else {
        return (
          <div className="verify-code">
            <p>{language.codeInputText}</p>
            <ReactInputVerificationCode
              length={6}
              onChange={(e) => {
                number["verificationCode"] = e;
                props.changeState("newNumber", number);
              }}
              value={number.verificationCode}
              placeholder={""}
            />
            {getVerificationCodeCounter(number)}
          </div>
        );
      }
    };
    const getDisabledOption = () => {
      if (props.modalState == "sendCode") {
        return number.method ? false : true;
      }
      return number.verificationCode != "" &&
        number.verificationCode?.length == 6
        ? false
        : true;
    };
    const body = <div className="verify-number-modal">{getBody()}</div>;
    const buttons = (
      <div className={`verify-number-buttons ${props.modalType}`}>
        <button
          className="blue"
          onClick={() => {
            props.modalState == "sendCode"
              ? props.sendVerificationCodeRequest(
                  number.channel_id,
                  number.method,
                  () => {
                    props.changeState("modalState", "verifyNumber");
                    props.getWabaLines();
                  }
                )
              : props.sendVerificationCode(
                  number.channel_id,
                  number.verificationCode,
                  () => {
                    props.onClose();
                    props.getWabaLines();
                  }
                );
            props.changeState("modalState", "loading");
          }}
          disabled={getDisabledOption()}
        >
          {language[props.modalState + "primaryButton"]}
        </button>
        {props.modalState == "sendCode" && (
          <button
            className="transparent"
            onClick={() => {
              props.modalState == "sendCode"
                ? props.onClose()
                : props.changeState("modalState", "sendCode");
            }}
          >
            {language[props.modalState + "secondaryButton"]}
          </button>
        )}
      </div>
    );
    return [
      body,
      buttons,
      props.modalState == "sendCode"
        ? language.sendCodeText
        : language.verifyNumberText,
      `verify-number-modal ${props.modalState}`,
    ];
  };
  const getModalContent = (type, resetState) => {
    if (conversationConfig.includes(type)) {
      return conversationsOptions(type);
    } else if (type == "channel") {
      return channelOptions();
    } else if (type == "new") {
      return newMemberOptions();
    } else if (type == "hubspot_installation") {
      return hubspotInstallationOptions();
    } else if (type == "hubspot_information") {
      return hubspotInformationOptions();
    } else if (type == "zendesk_installation") {
      return zendeskInstalationOptions(resetState);
    } else if (type == "zendesk_information") {
      return zendeskInformationOptions();
    } else if (type == "agentRedirection") {
      return agentRedirectionOpt();
    } else if (type == "addNewNumber") {
      return addNewNumeberOptions();
    } else if (type == "verifyNumber") {
      return verifyNumberOptions();
    }
  };

  const items = getModalContent(props.modalType, props.onClose);
  if (
    !["agentRedirection", "addNewNumber", "verifyNumber"].includes(
      props.modalType
    )
  ) {
    return (
      <Modal
        show={props.modalShow}
        onClose={props.onClose}
        title={items && items[2]}
        body={items && items[0]}
        buttons={items && items[1]}
      />
    );
  } else {
    return (
      <CustomModal
        show={props.modalShow}
        onClose={props.onClose}
        title={items && items[2]}
        body={items && items[0]}
        buttons={items && items[1]}
        class={items && items[3]}
      />
    );
  }
};

export default ModalSettings;
