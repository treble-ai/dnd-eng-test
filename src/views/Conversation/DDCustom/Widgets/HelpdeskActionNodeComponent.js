import React from "react";
import { Modal, Button } from "antd";
import Toaster from "@bit/treble.components.toaster";
import _ from "lodash";

import SearchableDropdownV2 from "Components/SearchableDropdownV2";
import SelectDropdownV2 from "Components/SelectDropdownV2";
import MultipleSelectDropdownV2 from "Components/MultipleSelectDropdownV2";
import TrebleInput from "Components/TrebleInput";
import SelectDropdown from "Components/SelectDropdown";
import TrebleIcon from "Components/TrebleIcon";

import InputPortWidget from "./InputPortWidget";
import OutputPortWidget from "./OutputPortWidget";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

const DUPLICATE_OPTION = "DUPLICATE";
const DELETE_OPTION = "DELETE";

export default class HelpdeskActionNodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      variable: this.props.node.getVariable(),
      value: this.props.node.getValue(),
      action: this.props.node.getAction(),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      _.isEqual(this.props.selectedNode, this.props.node) &&
      this.state.showModal === false
    ) {
      this.setState({ showModal: true });
    }
    if (prevState.showModal === true && this.state.showModal === false) {
      this.setState({
        variable: this.props.node.getVariable(),
        value: this.props.node.getValue(),
        action: this.props.node.getAction(),
      });
    }
  }

  renderHeader = () => {
    const { node, diagramEngine } = this.props;
    let helpdeskIcon;
    if (node.helpdeskType !== null) {
      helpdeskIcon = (
        <div className="helpdesk-pill">
          <div className={`icon icon--${node.helpdeskType}`} />
        </div>
      );
    }
    return (
      <div className="header">
        <div className="left">
          <p>{language.helpdeskAction}</p>
          {helpdeskIcon}
        </div>
        <div className="right">
          <SelectDropdown
            options={[
              {
                value: DUPLICATE_OPTION,
                label: language.duplicate,
                icon: "copy",
              },
              { value: DELETE_OPTION, label: language.delete, icon: "trash" },
            ]}
            display={(item) => {
              return [
                <TrebleIcon name={item.icon} size={18} />,
                <p>{item.label}</p>,
              ];
            }}
            triggerComponent={
              <div>
                <TrebleIcon name="options" size={24} cursor="pointer" />
              </div>
            }
            onSelect={(item) => {
              if (item.value == DUPLICATE_OPTION) {
                diagramEngine.diagramModel.cloneNode(node);
              }
              if (item.value == DELETE_OPTION) {
                node.remove();
              }
              diagramEngine.forceUpdate();
            }}
          />
          {node.variable && node.value ? (
            <TrebleIcon
              name={"edit-circle"}
              size={28}
              onClick={() => {
                this.setState({ showModal: true });
              }}
              cursor="pointer"
            />
          ) : null}
        </div>
      </div>
    );
  };

  handleCloseModal = () => {
    this.props.selectNode(null);
    this.setState({ showModal: false });
  };

  renderBody = () => {
    const { node } = this.props;
    let body = (
      <div
        className="add-action"
        onClick={() => {
          this.setState({ showModal: true });
        }}
      >
        <div className="icon icon--plus-circle" />
        <p>{language.newAction}</p>
      </div>
    );
    if (node.variable !== null && node.value !== null) {
      let valueBody;
      if (node.variable.type === "INPUT") {
        valueBody = (
          <div className="value-container">
            <p>{language.place}:</p>
            <p className="value">{node.value}</p>
          </div>
        );
      } else if (node.variable.type === "SELECT") {
        valueBody = (
          <div className="value-container">
            <p>{language.place}:</p>
            <p className="value">{node.value.label}</p>
          </div>
        );
      } else if (node.variable.type === "MULTI-SELECT") {
        let action;
        if (node.action.value === "UPDATE") {
          action = language.replaceWith;
        } else if (node.action.value === "ADD") {
          action = language.add;
        } else if (node.action.value === "REMOVE") {
          action = language.remove;
        }
        valueBody = (
          <div className="value-container">
            <p>{action}:</p>
            {node.value.map((value) => (
              <p className="value">{value.label}</p>
            ))}
          </div>
        );
      }

      body = (
        <div className="action">
          <div className="variable-container">
            <p>{language.inProperty}:</p>
            <p className="variable">{node.variable.label}</p>
          </div>
          {valueBody}
        </div>
      );
    }
    return <div className="body">{body}</div>;
  };

  renderStep = (number) => {
    return <div className="step">{number}</div>;
  };

  selectVariable = (variable) => {
    this.setState({ variable, action: { value: "UPDATE" }, value: null });
    this.forceUpdate();
  };

  setValue = (value) => {
    this.setState({ value });
    this.forceUpdate();
  };

  setAction = (action) => {
    this.setState({ action });
    this.forceUpdate();
  };

  renderStepOne = () => {
    const { helpdeskProperties } = this.props;

    return (
      <div className="treble-container">
        <div className="row">
          {this.renderStep(1)}
          {language.selectProperty}
        </div>
        <div>
          <SearchableDropdownV2
            placeholder={language.selectPropertyPH}
            searchPlaceholder={language.searchByNamePH}
            options={helpdeskProperties?.contacts?.properties ?? []}
            searchBy={(property) => property.label}
            optionHeight={35}
            listHeight={224}
            onSelect={this.selectVariable}
            value={this.state.variable}
          />
        </div>
      </div>
    );
  };

  getInputForVariable = () => {
    const variable = this.state.variable;
    if (variable.type === "INPUT") {
      if (variable.subtype === "STRING") {
        return (
          <TrebleInput
            placeholder={language.inputPH}
            type="TEXT"
            onChange={this.setValue}
            value={this.state.value}
          />
        );
      } else if (variable.subtype === "NUMBER") {
        return (
          <TrebleInput
            placeholder={language.inputPH}
            type="NUMBER"
            onChange={this.setValue}
            value={this.state.value}
          />
        );
      }
    } else if (variable.type === "SELECT") {
      return (
        <SelectDropdownV2
          placeholder={language.selectValuePH}
          options={variable.options}
          optionHeight={35}
          listHeight={224}
          onSelect={this.setValue}
          value={this.state.value}
        />
      );
    } else if (variable.type === "MULTI-SELECT") {
      return (
        <div className="multiselect">
          <SelectDropdownV2
            options={[
              {
                label: language.replace,
                value: "UPDATE",
              },
              {
                label: language.add,
                value: "ADD",
              },
              {
                label: language.remove,
                value: "REMOVE",
              },
            ]}
            optionHeight={35}
            listHeight={224}
            onSelect={this.setAction}
            value={this.state.action}
          />
          <MultipleSelectDropdownV2
            placeholder={language.selectMultiplePH}
            options={variable.options}
            optionHeight={35}
            listHeight={224}
            onChange={this.setValue}
            value={this.state.value === null ? [] : this.state.value}
          />
        </div>
      );
    }
  };

  getStepTextForVariable = () => {
    const variable = this.state.variable;
    if (variable.type === "INPUT") {
      if (variable.subtype === "STRING") {
        return language.saveAsText;
      } else if (variable.subtype === "NUMBER") {
        return language.saveAsNumber;
      }
    } else if (variable.type === "SELECT") {
      return language.saveAsOption;
    } else if (variable.type === "MULTI-SELECT") {
      return language.saveAsMultipleOption;
    }
  };

  renderStepTwo = () => {
    if (this.state.variable === null) return;
    return (
      <div className="treble-container">
        <div className="row">
          {this.renderStep(2)}
          {this.getStepTextForVariable()}
        </div>
        <div>{this.getInputForVariable()}</div>
      </div>
    );
  };

  renderHelpdeskInformation = () => {
    const { node } = this.props;
    return (
      <div className="helpdesk-information">
        <p>{language.saveAt}</p>
        <div className="helpdesk-pill">
          <div className={`icon icon--${node.helpdeskType}`} />
        </div>
      </div>
    );
  };

  save = () => {
    const { node } = this.props;
    const variable = this.state.variable;
    if (variable === null) {
      Toaster({
        title: language.helpdeskActionError1,
        type: "error",
        closeButton: true,
      });
      return;
    }
    const value = this.state.value;
    if (value === null) {
      Toaster({
        title: language.helpdeskActionError2,
        type: "error",
        closeButton: true,
      });
      return;
    }
    node.saveValues(this.state.variable, this.state.value, this.state.action);
    this.handleCloseModal();
  };

  renderFooter = () => {
    return <Button onClick={this.save}>{language.saveAndContinue}</Button>;
  };

  renderModal = () => {
    return (
      <Modal
        title={language.helpdeskAction}
        wrapClassName="helpdesk-action-modal"
        footer={this.renderFooter()}
        visible={this.state.showModal}
        onCancel={this.handleCloseModal}
        maskClosable={false}
        centered
      >
        {this.renderStepOne()}
        {this.renderStepTwo()}
        {this.renderHelpdeskInformation()}
      </Modal>
    );
  };

  renderInputPort() {
    const { node } = this.props;

    const port = node.getInPort();

    if (!port) return;

    return <InputPortWidget name={port.name} port={port} />;
  }

  renderOutputPort() {
    const { node } = this.props;

    const port = node.getOutPort();

    if (!port) return;

    return <OutputPortWidget port={port} />;
  }

  render() {
    const { node } = this.props;

    return (
      <div
        id="helpdesk-action-node"
        className="helpdesk-action-node node"
        data-nodeid={node.getID()}
      >
        {this.renderInputPort()}
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderModal()}
        {this.renderOutputPort()}
      </div>
    );
  }
}
