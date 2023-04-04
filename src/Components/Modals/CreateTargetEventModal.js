import React, { useEffect, useState } from "react";
import getLanguage from "getLanguage.js";
import languages from "./languages";
import constants from "../../assets/constants";
import { CAMPAIGN_GOAL_OPTIONS, TARGET_EVENT_OPTIONS } from "./mappers";
import "./CreateTargetEventModal.scss";
import { Modal, Slider } from "antd";
import * as linkify from "linkifyjs";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SelectDropdown from "Components/SelectDropdown";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { operations } from "views/Conversation/duck";

const language = languages[getLanguage()];
const CreateTargetEventModal = (props) => {
  const MAX_TARGET_LINKS_BY_NODE = 7;

  const initialState = {
    campaignGoal: "",
    targetEvents: [
      {
        type: "",
      },
    ],
  };

  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => {
    const currentGoalMeasurement = props.node.getGoalMeasurement();

    if (props.configured) {
      setState({
        ...state,
        campaignGoal: currentGoalMeasurement.campaignGoal,
        targetEvents: currentGoalMeasurement.targetEvents,
      });
    } else if (props.node.hsm && props.node.hasButtonLink()) {
      setState({
        ...state,
        targetEvents: [
          {
            type: constants.TARGET_EVENT_BUTTON_LINK,
            url: props.node.hsm.buttons.options[0].target_url,
            expectationValue: 80,
          },
        ],
      });
    }

    return () => {
      setState({
        ...state,
        ...initialState,
      });
    };
  }, [props.show]);

  const validForm =
    state.campaignGoal &&
    state.targetEvents.every(
      (target) =>
        target.type === constants.TARGET_EVENT_READ ||
        ([
          constants.TARGET_EVENT_BUTTON_LINK,
          constants.TARGET_EVENT_LINK,
        ].includes(target.type) &&
          target.url)
    ) &&
    (!props.node.hsm ||
      !props.node.hasButtonLink() ||
      state.targetEvents.some(
        (target) => target.type === constants.TARGET_EVENT_BUTTON_LINK
      ));

  let linksInTextInNode = linkify
    .find(props.node.getText(), "url")
    .map((link) => link.href);

  if (!linksInTextInNode.length) linksInTextInNode = [language.linksNotFound];

  const updateQuestionText = (url) => {
    let link = linkify
      .find(props.node.getText(), "url")
      .filter((link) => link.href == url);
    if (link) {
      props.node.setText(
        props.node.getText().replace(link[0].value, link[0].href)
      );
      props.forceUpdate();
    }
  };

  const handleChangeInputEvent = (e, index = 0) => {
    if (
      (e.target?.name == "url" && e.target?.value == language.linksNotFound) ||
      (e.target?.name === "type" &&
        e.target.value === constants.TARGET_EVENT_BUTTON_LINK &&
        !props.node.hsm?.buttons?.options[0]?.target_url)
    ) {
      return;
    }
    setState({
      ...state,
      targetEvents: state.targetEvents.map((target, idx) => {
        if (idx == index) {
          if (e.target.name === "type") {
            target = {};
            if (
              [
                constants.TARGET_EVENT_BUTTON_LINK,
                constants.TARGET_EVENT_LINK,
              ].includes(e.target.value)
            ) {
              target["expectationValue"] = 80;
            }
            if (e.target.value === constants.TARGET_EVENT_BUTTON_LINK) {
              target["url"] = props.node.hsm.buttons.options[0].target_url;
            }
          } else if (e.target.name === "url") {
            updateQuestionText(e.target.value);
          }
          target[e.target.name] = e.target.value;
        }
        return target;
      }),
    });
  };

  const createNewGoal = () => {
    if (
      [...new Set(state.targetEvents.map((target) => target?.url))].length !=
      state.targetEvents.map((target) => target?.url).length
    ) {
      toast.error(language.repeatedUrls, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const targetEvents = [];

    state.targetEvents.map((target) => {
      const targetEvent = {
        type: target.type,
      };
      if (
        [
          constants.TARGET_EVENT_BUTTON_LINK,
          constants.TARGET_EVENT_LINK,
        ].includes(target.type) &&
        target.url
      ) {
        targetEvent["url"] = target.url;
        targetEvent["expectationValue"] = Math.min(
          Math.max(Number(target.expectationValue), 0),
          100
        );
      }
      targetEvents.push(targetEvent);
    });

    props.node.updateGoalMeasurement({
      campaignGoal: state.campaignGoal,
      targetEvents: targetEvents,
    });

    props.setConfigured();
    props.forceUpdate();
  };

  const addNewTargetEventForm = () => {
    setState({
      ...state,
      targetEvents: state.targetEvents.concat({
        type: "",
      }),
    });
  };

  const deleteTargetEventForm = () => {
    setState({
      ...state,
      targetEvents: state.targetEvents.slice(0, state.targetEvents.length - 1),
    });
  };

  const renderTriggerComponent = (value, defaultValue, field) => {
    if (field == "target") {
      const targetType = value ? value.toLowerCase() : "";
      value = TARGET_EVENT_OPTIONS.filter((e) => e.value == value)[0]?.label;
      return (
        <button className={`${targetType ? "selected" : ""}`}>
          <div className="selected-item-container">
            <div
              className={targetType ? `${targetType}-icon` : "gold-goal-icon"}
            ></div>
            <p className="r">{value || defaultValue}</p>
          </div>
          <div className="dropdown-arrow" />
        </button>
      );
    }
    return (
      <button className={`${value ? "selected" : ""}`}>
        <p className="r">{value || defaultValue}</p>
        <div className="dropdown-arrow" />
      </button>
    );
  };

  const renderDropdownItem = (itemLabel, itemValue, selectedValue) => {
    if (
      itemValue == constants.TARGET_EVENT_BUTTON_LINK &&
      !props.node.hsm.buttons.options[0].target_url
    ) {
      return renderDisabledButtonLinkOption(itemLabel);
    }
    const icon =
      itemValue === selectedValue ? <div className="icon--check" /> : null;
    return (
      <>
        <p className="r lh-22">{itemLabel}</p>
        {icon}
      </>
    );
  };

  const renderDisabledButtonLinkOption = (itemLabel) => {
    return (
      <OverlayTrigger
        placement={"top-start"}
        delay={{ show: 50, hide: 400 }}
        overlay={
          <Tooltip className="button-link-tooltip">
            <>
              <p>{language.buttonLinkDisableTooltip1}</p>
              <br />
              <p>{language.buttonLinkDisableTooltip2}</p>
            </>
          </Tooltip>
        }
        overlayOpen={false}
      >
        <div className="icon-and-text">
          <div className="icon--exclamation" />
          <p>{itemLabel}</p>
        </div>
      </OverlayTrigger>
    );
  };

  const getModalBody = () => {
    return (
      <div className="new-goal-body">
        <div className="choice-busisness-goal-container">
          <p>{language.selectGoalCampaign}</p>
          <SelectDropdown
            options={CAMPAIGN_GOAL_OPTIONS}
            display={(item) =>
              renderDropdownItem(item.label, item.value, state.campaignGoal)
            }
            onSelect={(target) =>
              setState({ ...state, campaignGoal: target.value })
            }
            triggerComponent={renderTriggerComponent(
              CAMPAIGN_GOAL_OPTIONS.filter(
                (e) => e.value == state.campaignGoal
              )[0]?.label,
              language.selectOption
            )}
          ></SelectDropdown>
        </div>
        <div className="define-goal-type-container">
          <p className="define-variables-title">{language.defineGoals}</p>
          {state.targetEvents.map((target, index) => {
            const targetEventOptions = TARGET_EVENT_OPTIONS.filter(
              (event) =>
                (event.value == constants.TARGET_EVENT_BUTTON_LINK &&
                  props.node.hsm?.buttons?.type === "call_to_action" &&
                  !state.targetEvents.some(
                    (otherEvent) =>
                      otherEvent.type == constants.TARGET_EVENT_BUTTON_LINK
                  )) ||
                (event.value == constants.TARGET_EVENT_LINK &&
                  !props.node.hsm) ||
                (event.value == constants.TARGET_EVENT_READ &&
                  !state.targetEvents.some(
                    (otherEvent) =>
                      otherEvent.type == constants.TARGET_EVENT_READ
                  ))
            );
            return (
              <div key={index} className="goal-variable-container">
                <SelectDropdown
                  className="select-goal-type"
                  options={targetEventOptions}
                  display={(item) =>
                    renderDropdownItem(item.label, item.value, target.type)
                  }
                  onSelect={(e) =>
                    handleChangeInputEvent(
                      { target: { value: e.value, name: "type" } },
                      index
                    )
                  }
                  triggerComponent={renderTriggerComponent(
                    target.type,
                    language.selectGoalType,
                    "target"
                  )}
                ></SelectDropdown>
                {[
                  constants.TARGET_EVENT_BUTTON_LINK,
                  constants.TARGET_EVENT_LINK,
                ].includes(target.type) && (
                  <div className="link-settings">
                    {target.type == constants.TARGET_EVENT_LINK && (
                      <SelectDropdown
                        className="select-link"
                        options={linksInTextInNode}
                        display={(url) =>
                          renderDropdownItem(url, url, target.url)
                        }
                        onSelect={(e) =>
                          handleChangeInputEvent(
                            { target: { value: e, name: "url" } },
                            index
                          )
                        }
                        triggerComponent={renderTriggerComponent(
                          target.url,
                          language.selectLink
                        )}
                      />
                    )}
                    <div className="campaing-expectative">
                      <div className="icon-and-text">
                        <OverlayTrigger
                          placement={"top-start"}
                          delay={{ show: 50, hide: 400 }}
                          overlay={
                            <Tooltip className="campaing-expectative-tooltip">
                              <p>{language.defineExpectationsTooltip}</p>
                            </Tooltip>
                          }
                          overlayOpen={false}
                        >
                          <div className="icon icon--question" />
                        </OverlayTrigger>
                        <p>
                          {target.type == constants.TARGET_EVENT_LINK
                            ? language.defineExpectations
                            : language.defineButtonExpectations}
                        </p>
                      </div>
                      <div className="campaing-expectative-values">
                        <Slider
                          value={target.expectationValue}
                          min={0}
                          max={100}
                          tooltip={{
                            formatter: null,
                          }}
                          onChange={(newExpectation) =>
                            handleChangeInputEvent(
                              {
                                target: {
                                  value: newExpectation,
                                  name: "expectationValue",
                                },
                              },
                              index
                            )
                          }
                        />
                        <div className="expectation-value">
                          <p>
                            {target.expectationValue}
                            {language.clicksPercentage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="dashed-divider"></div>
              </div>
            );
          })}
          <div className="add-delete-goal-container">
            {state.targetEvents.length > 1 && (
              <div className="subtract-goal" onClick={deleteTargetEventForm}>
                <div className="subtract-icon"></div>
                <p>{language.deleteGoal}</p>
              </div>
            )}
            {state.targetEvents.length < MAX_TARGET_LINKS_BY_NODE && (
              <div className="add-other-goal" onClick={addNewTargetEventForm}>
                <div className="plus-icon"></div>
                <p>{language.addOtherGoal}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderFooter = () => {
    return (
      <div className="create-buttons-container">
        <button
          className={`create-goal-now ${validForm && "is-valid"}`}
          onClick={createNewGoal}
          disabled={!validForm}
        >
          <p>{language.creatGoalBlock}</p>
        </button>
      </div>
    );
  };

  return (
    <Modal
      title={language.goalBlock}
      wrapClassName="create-target-event-modal"
      footer={renderFooter()}
      visible={props.show}
      onCancel={props.closeModal}
      closeIcon={<div class="close-icon"></div>}
      maskClosable={false}
      centered
      closable={
        props.configured || !props.node.hsm || !props.node.hasButtonLink()
      }
    >
      {getModalBody()}
    </Modal>
  );
};

export default CreateTargetEventModal;
