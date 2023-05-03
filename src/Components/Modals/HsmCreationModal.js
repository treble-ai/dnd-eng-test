import React, { useEffect, useState } from "react";
import getLanguage from "getLanguage.js";
import languages from "./languages";
import constants from "../../assets/constants";
import { TARGET_EVENT_OPTIONS, TARGET_HSM_INTERVAL } from "./mappers";
import "./CreateTargetEventModal.scss";
import "./HsmCreationModal.scss";
import { Modal, Slider } from "antd";
import * as linkify from "linkifyjs";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SelectDropdown from "Components/SelectDropdown";
import { toast } from "react-toastify";
import TrebleInput from "../TrebleInput";
import HsmSearch from "../HSM/hsmSearch";
import { HSMNodeModel } from "../../views/Conversation/DDCustom/Models/HSMNodeModel";
import { DiagramEngine, LinkInstanceFactory } from "DDCanvas/main";
import { MoveItemsAction } from "../../DDCanvas/widgets/actions";
import { LinkModel, NodeModel, PointModel, PortModel } from "../../DDCanvas/Common";
import ColorfulText from "../Text/ColorfulText";
import { connect } from "react-redux";
import { operations } from "../../views/Conversation/duck";

const language = languages[getLanguage()];
const HsmCreationModal = (props) => {
  const diagramEngine = new DiagramEngine();

  const initialState = {
    hsmTemplate: "",
    intervalType: "MINUTE",
    intervalValue: 10,
  };

  const [state, setState] = useState(initialState);
  const [currentNode, setCurrentNode] = useState(false);
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [displayNotice, setDisplayNotice] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    const { intervalType, intervalValue, hsmTemplate } = state;
    if (
      (intervalType === "HOUR" && intervalValue > 60) ||
      (intervalType === "MINUTE" && intervalValue > 1440)
    ) {
      setDisplayError(language.intervalPeriod);
      setIsValid(false);
    } else if (hsmTemplate && intervalType && intervalValue) {
      setIsValid(true);
    } else {
      setDisplayError(false);
    }
  }, [state]);

  const addLink = (nodeModel, action, element) => {
  };

  const addNode = (NodeClass, node) => {
    let diagramModel = props.diagramEngine.getDiagramModel();
    let nodeModel = new NodeClass(node);
    nodeModel.x = -(diagramModel.offsetX - 500);
    nodeModel.y = -(diagramModel.offsetY - 200);

    let selectionModels = new MoveItemsAction(
      nodeModel.x,
      nodeModel.y,
      props.diagramEngine
    );

    diagramModel.addNode(nodeModel);

    addLink(props.node, selectionModels, diagramModel);
   

    props.diagramEngine.forceUpdate();

    return nodeModel;
  };

  let linksInTextInNode = linkify
    .find(props.node.getText(), "url")
    .map((link) => link.href);

  if (!linksInTextInNode.length) linksInTextInNode = [language.linksNotFound];

  const closeAndClear = () => {
    setCurrentNode(false);
    setDisplayDropDown(false);
    setIsValid(false);
    setDisplayError(false);
    setState(initialState);
    props.closeModal();
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
      <div className="new-goal-body hsm">
        <div className="choice-busisness-goal-container">
          <div className="hsm-modal-description">
            <ColorfulText text={language.hsmIntructions} color={"#C3C3FF"} />
            </div>
          <div className="hsm-step">
            <div className="hsm-one-icon"></div>
            <p>{language.hsmSelectTemplate}</p>
          </div>

          <div
            className="hsm-template-dropdown"
            contentEditable={false}
            suppressContentEditableWarning
            onClick={() => {
              setDisplayDropDown(true);
            }}
          >
            {state.hsmTemplate
              ? renderHsm(state.hsmTemplate)
              : language.hsmSelectTemplate}
            <div style={{ position: "absolute", right: "5px", top: "5px" }}>
              ▼
            </div>
          </div>
        </div>
        <div className="dashed-divider"></div>
        <div className="define-goal-type-container">
          <div className="hsm-step">
            <div className="hsm-two-icon"></div>
            <p>{language.hsmInterval}</p>
            <div
              className="hsm-notice-icon"
              onMouseOver={() => {
                setDisplayNotice(true);
              }}
              onMouseLeave={() => {
                setDisplayNotice(false);
              }}
            ></div>
          </div>
          {displayNotice && (
            <div className="interval-notice-container">
              {language.hsmNotice}
            </div>
          )}

          <div className="interval-input-container">
            <p>{language.hsmIntervalDescription}</p>
            <TrebleInput
              placeholder={state.intervalValue}
              type="NUMBER"
              onChange={(target) => {
                setState({ ...state, intervalValue: target });
              }}
              value={state.intervalValue}
            />

            <SelectDropdown
              options={TARGET_HSM_INTERVAL}
              display={(item) =>
                renderDropdownItem(item.label, item.value, state.intervalType)
              }
              onSelect={(target) =>
                setState({ ...state, intervalType: target.value })
              }
              triggerComponent={renderTriggerComponent(
                TARGET_HSM_INTERVAL.filter(
                  (e) => e.value == state.intervalType
                )[0]?.label,
                state.intervalType
              )}
            ></SelectDropdown>
          </div>
          {displayError && (
            <p style={{ color: "red" }}>{language.intervalPeriod}</p>
          )}
        </div>
      </div>
    );
  };
  const renderFooter = () => {
    console.log("currentNode", currentNode);
    return (
      <div className="hsm-buttons-container">
        <button
          className={`create-goal-now ${isValid && "is-valid"}`}
          onClick={() => {
            addNode(HSMNodeModel, state.hsmTemplate);
            closeAndClear();
          }}
          disabled={!isValid}
        >
          <p>{language.hsmCreate}</p>
        </button>
        <button className={`hsm-cancel`} onClick={props.closeModal}>
          <p>{language.cancel}</p>
        </button>
      </div>
    );
  };

  const renderHsm = (hsm) => {
    const metaDoc =
      "developers.facebook.com/docs/whatsapp/message-templates/guidelines#template-pausing";

    if (hsm.status == "PAUSED") {
      return (
        <>
          <p className="paused">{language.hsmPausedText}</p>
          <a href={`https://${metaDoc}`} target="_blank">
            {metaDoc}
          </a>
        </>
      );
    } else {
      return (
        <>
          <p>{hsm.header?.text ? hsm.header.text : hsm.header?.url}</p>
          <p>{hsm.content}</p>
          <p>{hsm.footer?.text ? hsm.footer.text : ""}</p>
          {hsm.buttons?.options.map((button) => {
            return (
              <p key={hsm.buttons?.options.indexOf(button)}>{button.text}</p>
            );
          })}
        </>
      );
    }
  };

  const renderExtendedView = () => {
    return <div className="hsm-side-container">{renderHsm(currentNode)}</div>;
  };

  const setTemplate = (hsm) => {
    setDisplayDropDown(false);
    setCurrentNode(false);
    setState({ ...state, hsmTemplate: hsm });
  };

  return (
    <Modal
      title={language.hsmBlock}
      wrapClassName="create-target-event-modal"
      footer={renderFooter()}
      visible={props.show}
      onCancel={props.closeModal}
      closeIcon={<div className="close-icon"></div>}
      maskClosable={false}
      centered
      closable={
        props.configured || !props.node.hsm || !props.node.hasButtonLink()
      }
    >
      {getModalBody()}
      {displayDropDown && (
        <HsmSearch
          props={props}
          setCurrentNode={setCurrentNode}
          currentNode={currentNode}
          renderHsm={renderHsm}
          setTemplate={setTemplate}
        />
      )}
      {currentNode && renderExtendedView()}
    </Modal>
  );
};

const mapDispatchToProps = {
    selectNode: operations.changeNodeSelected,
  };
  
  export default connect(null, mapDispatchToProps)(HsmCreationModal);