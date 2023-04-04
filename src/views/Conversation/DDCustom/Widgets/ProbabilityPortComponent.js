import React from "react";

import { InputNumber } from "antd";
import _ from "lodash";

import ImageTooltip from "../../ImageTooltip";
import SimpleTooltip from "../../SimpleTooltip";

import SelectDropdown from "Components/SelectDropdown";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];

const ANSWER_CLOSED_MENU_OPTION_DELETE = language.delete;

export default class AnswerPortWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      change: null,
    };

    this.setValue = this.setValue.bind(this);

    this.canDrag = false;
  }

  setValue(newValue) {
    let value = newValue;
    let node = this.props.port.getParent();
    const currentTotalProbability = node.getTotalProbabilities();
    const currentProbability = this.props.port.probability;
    const newTotal = currentTotalProbability - currentProbability + value;
    console.log("NEW TOTAL", newTotal);
    if (newTotal > 100) {
      value -= newTotal - 100;
      if (value < 0) {
        value = 0;
      }
    }
    console.log("VALUE", value);
    this.props.port.setProbability(value);
    this.forceUpdate();
  }

  renderProbabilityPort(port) {
    let node = port.getParent();
    const { provided, innerRef } = this.props;
    const showLinkRoute = port.getShowLinkRoute() && !_.isEqual(port.links, {});
    return (
      <div id="port-node-answer">
        <div
          className={
            `answer-port port-closed` //${extraClass}` //+ (this.state.editing ? "editing" : "")
          }
          ref={innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-portid={port.getID()}
        >
          <div className="question--port">
            <div className="line"></div>
            <div
              onMouseEnter={() => {
                if (!_.isEqual(port.links, {}) && !port.getShowLinkRoute()) {
                  port.setShowLinkRoute(true);
                  this.forceUpdate();
                }
              }}
              onMouseLeave={() => {
                if (port.getShowLinkRoute()) {
                  port.setShowLinkRoute(false);
                  this.forceUpdate();
                }
              }}
              className={`ball port closed ${showLinkRoute ? "show-link" : ""}`}
              data-name={port.getID()}
              data-nodeid={node.getID()}
              id={port.getID()}
            >
              {showLinkRoute && <div className="icon icon--arrow-forward" />}
            </div>
          </div>
          <div className="answer-input-container">
            <SimpleTooltip
              message={
                <>
                  <b>Click</b> {language.addBlock}
                </>
              }
              itemtohover={
                <span className="icon--plus closed-answer-icon"></span>
              }
              placement="bottom"
              onClick={() => {
                node.newProbabilityPortAfterPort(port);
                this.props.diagramEngine.forceUpdate();
              }}
            />
            <InputNumber
              controls={false}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
              value={port.probability}
              onChange={this.setValue}
            />
            <SelectDropdown
              options={[ANSWER_CLOSED_MENU_OPTION_DELETE]}
              display={(item) => {
                let iconName = {
                  [ANSWER_CLOSED_MENU_OPTION_DELETE]: "trash",
                };

                return [
                  <i className={`icon--${iconName[item]}`}></i>,
                  <p>{item}</p>,
                ];
              }}
              triggerComponent={
                <SimpleTooltip
                  message={
                    <>
                      <b>Click</b> {language.openMenu} <br className="small" />
                      <b>{language.drag}</b> {language.dragAction}
                    </>
                  }
                  itemtohover={
                    <span
                      onMouseEnter={() => {
                        this.canDrag = true;
                        this.props.changeDrag(this.canDrag);
                        this.props.diagramEngine.diagramModel.clearSelection(
                          false,
                          true
                        );
                      }}
                      onMouseLeave={() => {
                        this.canDrag = false;
                        this.props.changeDrag(this.canDrag);
                      }}
                      className="icon--handle closed-answer-icon"
                    ></span>
                  }
                  placement="right"
                />
              }
              onSelect={(item) => {
                if (item == ANSWER_CLOSED_MENU_OPTION_DELETE)
                  node.removePort(port);
                this.props.diagramEngine.forceUpdate();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { port } = this.props;
    return this.renderProbabilityPort(port);
  }
}
