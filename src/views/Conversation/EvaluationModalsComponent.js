import React, { Component } from "react";
import CustomModal from "Components/CustomModal";
import "./EvaluationModalsStyle.scss";
import events from "utils/events";

const tipsTypes = [
  "curiosity",
  "optout",
  "images",
  "short",
  "tone",
  "options",
  "target",
  "abtesting",
];

export default class EvaluationModalsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      innerType: tipsTypes[0],
    };
  }

  renderTipCustomContent = (type) => {
    if (type == "optout") {
      return (
        <div className="optout-custom-information">
          <h2>{this.props.language.benefits}</h2>
          <ul>
            {[1, 2].map((number) => {
              return <li>{this.props.language["optoutOption" + number]}</li>;
            })}
          </ul>
          <h2>{this.props.language.howToActivate}</h2>
          <div className="image image--optout" />
        </div>
      );
    } else {
      return <div className={`image image--${type}`}></div>;
    }
  };

  tipsOptions = () => {
    let body = (
      <div className="tips-body">
        <div className="tips-menu">
          <h1>{this.props.language.tipsMenuTitle}</h1>
          <div className="items-menu">
            {tipsTypes.map((option) => {
              return (
                <button
                  className={`tips-option ${
                    this.state.innerType == option ? "active" : ""
                  }`}
                  onClick={() => {
                    events.track("View tip", { "Tip name": option });
                    this.setState({ innerType: option });
                  }}
                >
                  <p>{this.props.language[option + "title"]}</p>
                  <button
                    className={this.state.innerType == option ? "active" : ""}
                  >
                    <div className={`icon icon--right-arrow`} />
                  </button>
                </button>
              );
            })}
          </div>
        </div>
        <div className="tips-content">
          <div className="button-container">
            <button onClick={this.props.onClose}>
              <div className="icon icon--close" />
            </button>
          </div>
          <h6>{this.props.language[this.state.innerType + "title"]}</h6>
          <p>{this.props.language[this.state.innerType + "mainInfo"]}</p>
          {!["tone", "optout"].includes(this.state.innerType) && (
            <h2>{this.props.language.example}</h2>
          )}
          {this.renderTipCustomContent(this.state.innerType)}
        </div>
      </div>
    );
    return [body, [], "", "tips-modal"];
  };
  handleButtonClick = () => {
    this.props.addNewNode();
    this.props.onClose();
  };
  evaluationItems = (type) => {
    let body = (
      <div className="evaluation-body">
        <div className="flex-container">
          <button onClick={this.props.onClose}>
            <div className="icon icon--close" />
          </button>
        </div>
        <div className="evaluation-item">
          <div className={`evaluation-text ${type}`}>
            <h6>{this.props.language[type + "title"]}</h6>
            <p>{this.props.language[type + "text"]}</p>
            {["BUTTONS_BLOCK", "TWO_BLOCK_MINIMUM", "EMOJIS"].includes(
              type
            ) && (
              <button
                className="blue"
                onClick={() => {
                  events.track("Click on mission modal CTA", {
                    Type: type,
                  });
                  this.handleButtonClick(type);
                }}
              >
                {this.props.language[type + "buttonText"]}
              </button>
            )}
          </div>
          <div className="evaluation-image">
            <div className={`image image--${type}`}></div>;
          </div>
        </div>
      </div>
    );
    return [body, [], "", "evaluation-modal"];
  };

  automaticImproveInformation = (extra) => {
    const [hsmGoal, buttonsQuestion, emojiQuestion] = extra;

    let body = (
      <div className="automatic-body">
        <p>{this.props.language.automaticImprovementText}</p>
        <div className="automatic-items">
          {[hsmGoal, buttonsQuestion, emojiQuestion].map((variable, number) => {
            if (!variable) return;
            return (
              <p>
                {this.props.language["automaticImprovement" + (number + 1)]}
              </p>
            );
          })}
        </div>
      </div>
    );
    let buttons = (
      <button
        className="blue"
        onClick={() => {
          events.track("Automatic improvement usage", {
            "Buttons Block": buttonsQuestion,
            Emojis: emojiQuestion,
            "HSM Goal": hsmGoal,
          });
          this.props.automaticImprovement(
            hsmGoal,
            buttonsQuestion,
            emojiQuestion
          );
          this.props.onClose();
        }}
      >
        {this.props.language.automaticImprovementButtonText}
      </button>
    );

    return [
      body,
      buttons,
      this.props.language.automaticImprovementTitle,
      "automatic-improvement",
    ];
  };

  getModalContent = (type, extra) => {
    if (type == "tips") {
      return this.tipsOptions();
    } else if (type == "automaticImprovement") {
      return this.automaticImproveInformation(extra);
    } else {
      return this.evaluationItems(type);
    }
  };

  render() {
    if (!this.props.modal) return null;
    const items = this.getModalContent(
      this.props.modal.type,
      this.props.modal.extra
    );
    return (
      <CustomModal
        show={this.props.modal ? true : false}
        onClose={this.props.onClose}
        title={items && items[2]}
        body={items && items[0]}
        buttons={items && items[1]}
        class={items && items[3]}
      />
    );
  }
}
