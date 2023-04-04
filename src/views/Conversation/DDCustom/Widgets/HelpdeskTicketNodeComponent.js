import React from "react";
import { Modal, Button } from "antd";
import _ from "lodash";

import Toaster from "@bit/treble.components.toaster";

import SelectDropdownV2 from "Components/SelectDropdownV2";
import MultipleSelectDropdownV2 from "Components/MultipleSelectDropdownV2";
import TrebleInput from "Components/TrebleInput";
import SelectDropdown from "Components/SelectDropdown";
import TrebleIcon from "Components/TrebleIcon";
import HelpdeskPropertySelector from "Components/HelpdeskPropertySelector";
import HelpdeskTicketNodeModal from "./Modals/HelpdeskTicketNodeModal";

import InputPortWidget from "./InputPortWidget";
import OutputPortWidget from "./OutputPortWidget";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

const DUPLICATE_OPTION = "DUPLICATE";
const DELETE_OPTION = "DELETE";

export default class HelpdeskTicketNodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      validated: false,
    };
  }

  componentDidUpdate() {
    if (
      _.isEqual(this.props.selectedNode, this.props.node) &&
      this.state.showModal === false
    ) {
      this.setState({ showModal: true, validated: false });
    }
  }

  validate = () => {
    const { node } = this.props;
    const subject = node.getValue("subject");
    const pipeline = node.getPipeline();

    return subject !== null && subject !== "" && pipeline.id && pipeline.stage;
  };

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
          <p>{language.helpdeskTicket}</p>
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
          {this.validate() ? (
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

  handleCloseModal = (save) => {
    const { node } = this.props;
    const subject = node.getValue("subject");
    const pipeline = node.getPipeline();

    let valid =
      subject !== null && subject !== "" && pipeline.id && pipeline.stage;
    if (save && !valid) {
      Toaster({
        title: language.helpdeskTicketRequiredFields,
        type: "error",
        closeButton: true,
      });
      this.setState({ validated: true });
      return;
    } else if (!valid) {
      node.clear();
    }
    node.saveValues();
    this.props.selectNode(null);
    this.setState({ showModal: false, validated: false });
  };

  renderBody = () => {
    const { node } = this.props;
    let body = (
      <div
        className="add-ticket"
        onClick={() => {
          this.setState({ showModal: true });
        }}
      >
        <div className="icon icon--plus-circle" />
        <p>{language.createHelpdeskTicket}</p>
      </div>
    );

    if (this.validate()) {
      const subject = node.getValue("subject");
      const pipeline = node.getPipeline();
      let pipelines = this.props.helpdeskProperties?.pipelines ?? [];
      let foundPipeline = pipelines.filter((p) => p.value === pipeline.id);
      body = (
        <div className="ticket">
          <div className="ticket-container">
            <div className="subject">{subject}</div>
            <div className="pipeline">
              <p>Pipeline: </p>
              <p>{foundPipeline.length > 0 ? foundPipeline[0].label : "..."}</p>
            </div>
          </div>
        </div>
      );
    }
    return <div className="body">{body}</div>;
  };

  renderModal = () => {
    if (this.state.showModal) {
      console.log(this.props.node);
    }

    if (!this.props.helpdeskProperties) {
      return;
    }

    return (
      <HelpdeskTicketNodeModal
        language={language}
        node={this.props.node}
        diagramEngine={this.props.diagramEngine}
        helpdeskProperties={this.props.helpdeskProperties}
        handleCloseModal={() => this.handleCloseModal(false)}
        showModal={this.state.showModal}
        validated={this.props.validated}
      />
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
        id={`helpdesk-ticket-node-${node.getID()}`}
        className="helpdesk-ticket-node node"
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
