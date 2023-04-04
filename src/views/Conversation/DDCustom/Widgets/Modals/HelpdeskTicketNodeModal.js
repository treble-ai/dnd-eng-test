import React, { PureComponent } from "react";
import { Modal, Button } from "antd";

import SelectDropdownV2 from "Components/SelectDropdownV2";
import MultipleSelectDropdownV2 from "Components/MultipleSelectDropdownV2";
import TrebleInput from "Components/TrebleInput";
import HelpdeskPropertySelector from "Components/HelpdeskPropertySelector";

class HelpdeskTicketProperty extends PureComponent {
  constructor(props) {
    super(props);
    this.language = props.language;
  }

  setValue = (property, value) => {
    const { node, diagramEngine } = this.props;
    node.setValue(property.value, value);
    diagramEngine.forceUpdate();
    this.forceUpdate();
  };

  getInputForProperty = (property) => {
    const { node } = this.props;
    if (property.type === "INPUT") {
      if (property.subtype === "STRING") {
        return (
          <>
            <TrebleInput
              placeholder={this.language.inputPH}
              type="TEXT"
              onChange={(e) => this.setValue(property, e)}
              value={node.getValue(property.value)}
            />
            <HelpdeskPropertySelector
              language={this.language}
              searchPlaceholder={this.language.searchByNamePH}
              onSelect={(e) => {
                this.setValue(
                  property,
                  `${node.getValue(property.value) ?? ""}` +
                    `{{hubspot_${e.value}}}`
                );
                this.forceUpdate();
              }}
            />
          </>
        );
      } else if (property.subtype === "NUMBER") {
        return (
          <TrebleInput
            placeholder={this.language.inputPH}
            type="NUMBER"
            onChange={(e) => this.setValue(property, e)}
            value={node.getValue(property.value)}
          />
        );
      }
    } else if (property.type === "SELECT") {
      if (property.value === "source_type") {
        let sourceProperty = this.props.helpdeskProperties.properties.filter(
          (p) => p.value === property.value
        )[0];
        let hasWhatsapp = sourceProperty.options.filter(
          (o) => o.value === "WHATSAPP"
        );
        if (
          hasWhatsapp.length === 0 &&
          node.getValue(property.value) === "WHATSAPP"
        ) {
          this.setValue(property, sourceProperty.options[0].value);
        }
      }

      return (
        <SelectDropdownV2
          addEmptyOption={true}
          placeholder={this.language.selectValuePH}
          options={property.options}
          optionHeight={35}
          listHeight={224}
          onSelect={(e) => this.setValue(property, e)}
          value={node.getValue(property.value)}
        />
      );
    } else if (property.type === "MULTI-SELECT") {
      return (
        <div className="multiselect">
          <MultipleSelectDropdownV2
            placeholder={this.language.selectMultiplePH}
            options={property.options}
            optionHeight={35}
            listHeight={224}
            onChange={(e) => this.setValue(property, e)}
            value={
              node.getValue(property.value) === null
                ? []
                : node.getValue(property.value)
            }
          />
        </div>
      );
    }
  };

  render = () => {
    const { property, idx } = this.props;
    const required = property.value === "subject";

    return (
      <div className="ticket-property" key={idx}>
        <p>
          {property.label}
          {property.value === "subject" ? " *" : ""}
        </p>
        <div
          className={`ticket-property-input ${
            required && this.props.validated ? "missing" : ""
          }`}
        >
          {this.getInputForProperty(property)}
        </div>
      </div>
    );
  };
}

class HelpdeskTicketContent extends PureComponent {
  constructor(props) {
    super(props);
    this.language = props.language;
  }

  setPipeline = (pipeline, stage) => {
    const { node, diagramEngine } = this.props;
    node.setPipeline(pipeline, stage);
    diagramEngine.forceUpdate();
    this.forceUpdate();
  };

  renderPipelines = () => {
    const { helpdeskProperties, node } = this.props;

    let pipelines = helpdeskProperties.pipelines;

    let nodePipeline = node.getPipeline();

    let foundPipelines = pipelines.filter((p) => p.value === nodePipeline.id);

    let currentPipeline;
    if (foundPipelines.length === 0) {
      currentPipeline = pipelines[0];
      this.setPipeline(currentPipeline.value, currentPipeline.stages[0].value);
    } else {
      currentPipeline = foundPipelines[0];
    }

    return (
      <>
        <div className="ticket-pipeline">
          <p>Pipeline *</p>
          <SelectDropdownV2
            placeholder={this.language.selectValuePH}
            options={pipelines}
            optionHeight={35}
            listHeight={224}
            onSelect={(e) => this.setPipeline(e.value, e.stages[0].value)}
            value={nodePipeline.id}
          />
        </div>
        <div className="ticket-pipeline">
          <p>Ticket status *</p>
          <SelectDropdownV2
            placeholder={this.language.selectValuePH}
            options={currentPipeline.stages}
            optionHeight={35}
            listHeight={224}
            onSelect={(e) => this.setPipeline(nodePipeline.id, e.value)}
            value={nodePipeline.stage}
          />
        </div>
      </>
    );
  };

  render() {
    const { helpdeskProperties } = this.props;
    let editableProperties = helpdeskProperties.properties.filter(
      (p) => !p.read_only
    );

    return (
      <div className="create-ticket">
        <HelpdeskTicketProperty
          idx={editableProperties.length + 1}
          property={editableProperties.filter((p) => p.value === "subject")[0]}
          language={this.language}
          node={this.props.node}
          diagramEngine={this.props.diagramEngine}
          helpdeskProperties={this.props.helpdeskProperties}
        />
        {this.renderPipelines()}
        {editableProperties.map((p, idx) => {
          if (p.value !== "subject") {
            return (
              <HelpdeskTicketProperty
                idx={idx}
                property={p}
                language={this.language}
                node={this.props.node}
                diagramEngine={this.props.diagramEngine}
                helpdeskProperties={this.props.helpdeskProperties}
              />
            );
          }
        })}
      </div>
    );
  }
}

export default class HelpdeskTicketNodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.language = props.language;
  }

  renderFooter = () => {
    return (
      <>
        <Button
          className="cancel"
          onClick={() => this.props.handleCloseModal()}
        >
          {this.language.cancel}
        </Button>
        <Button className="save" onClick={() => this.props.handleCloseModal()}>
          {this.language.saveAndContinue}
        </Button>
      </>
    );
  };

  render() {
    let helpdeskIcon;
    if (this.props.node.helpdeskType !== null) {
      helpdeskIcon = (
        <div className="helpdesk-pill">
          <div className={`icon icon--${this.props.node.helpdeskType}`} />
        </div>
      );
    }
    return (
      <Modal
        title={
          <>
            <p>{this.language.helpdeskTicket}</p>
            {helpdeskIcon}
          </>
        }
        wrapClassName="helpdesk-ticket-modal"
        footer={this.renderFooter()}
        visible={this.props.showModal}
        onCancel={() => this.props.handleCloseModal()}
        maskClosable={false}
        centered
      >
        <HelpdeskTicketContent
          language={this.props.language}
          node={this.props.node}
          diagramEngine={this.props.diagramEngine}
          helpdeskProperties={this.props.helpdeskProperties}
          validated={this.props.validated}
        />
      </Modal>
    );
  }
}
