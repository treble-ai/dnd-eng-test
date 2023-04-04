import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";
import TrebleLoader from "Components/TrebleLoader";
import "./ActionCheckBox.scss";

const LOADING = "loading";
const SELECTED = "selected";

class ActionCheckBox extends Component {
  /**
   *
   * @param {*} props
   * loading
   * actionList: [{ icon, name, opt }]
   * buttonAction
   * runAction
   * actionRuning
   * openContent
   * trigger
   * triggerAction
   * -- optional --
   * class
   * openContent
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      actionSelected: null,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loading !== this.props.loading) {
      if (prevProps.loading) {
        this.setState({ open: false });
      }
    }
  }
  handleClickOutside = (event) => {
    this.setState({ open: false });
  };
  renderAction = (action) => {
    return (
      <div
        className="action"
        onClick={() => this.setState({ actionSelected: action })}
        key={action.name}
      >
        {action.icon && <div className={`icon icon--${action.icon}`} />}
        <p>{action.name}</p>
        <div className="checkbox">
          {this.state.actionSelected &&
            action.opt === this.state.actionSelected.opt && (
              <div className="checked" />
            )}
        </div>
      </div>
    );
  };
  actionState = () => {
    if (this.props.loading) return LOADING;
    if (this.state.actionSelected) return SELECTED;
    return "";
  };
  renderActionCheckBox = () => {
    const actionState = this.actionState();
    return (
      <div className="action-checkbox-content">
        <div className="title">
          <h2>{this.props.title}</h2>
        </div>
        {this.props.actionList.map((action) => this.renderAction(action))}
        <div
          className={`button button-action ${actionState}`}
          onClick={() => this.props.triggerAction(this.state.actionSelected)}
        >
          <p>
            {actionState === LOADING
              ? this.props.actionRuning
              : this.props.runAction}
          </p>
          {actionState === LOADING && <TrebleLoader />}
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className={`action-checkbox ${this.props.class}`}>
        <div
          className="action-checkbox-trigger"
          onClick={() => {
            if (this.props.openContent) this.setState({ open: true });
          }}
        >
          {this.props.trigger}
        </div>
        {this.state.open ? this.renderActionCheckBox() : ""}
      </div>
    );
  }
}

export default onClickOutside(ActionCheckBox);
