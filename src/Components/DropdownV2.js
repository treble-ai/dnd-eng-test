import React, { PureComponent } from "react";
import onClickOutside from "react-onclickoutside";

/*
	props:
		- title str: dropdown button text
		- hideOnBodyClick bool false: Determine whether to hide the drowpdown when an option is clicked
    - dropdownIcon
*/

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  dropdownWrap = React.createRef();

  componentDidMount() {
    this.dropdownWrap.current &&
      (this.dropdownWrap.current.onmouseenter = () => {
        this.props.disableDiagramScroll();
      });
    this.dropdownWrap.current &&
      (this.dropdownWrap.current.onmouseleave = () => {
        this.props.enableDiagramScroll();
      });
  }

  handleClickOutside = (evt) => {
    if (this.props.hideOnClickOutside === false) return;
    this.setState({ open: false });
  };

  onBodyClick = () => {
    if (this.props.hideOnBodyClick !== true) return;
    this.setState({ open: false });
  };

  toggle = (toggleBoolean) => {
    this.setState({ open: toggleBoolean });
  };

  renderDropdownIcon = () => {
    if (this.props.dropdownIcon) {
      return <div className={`icon icon--${this.props.dropdownIcon}`}></div>;
    }
    return (
      <span className="icon is-small">
        <i className="fa fa-caret-down" aria-hidden="true"></i>
      </span>
    );
  };

  renderToggle = () => {
    if (this.props.triggerComponent) {
      return (
        <div onClick={() => this.setState({ open: !this.state.open })}>
          {this.props.triggerComponent}
        </div>
      );
    } else {
      return (
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <p className="r">{this.props.title}</p>
          {this.renderDropdownIcon()}
        </button>
      );
    }
  };

  render = () => {
    let direction = this.props.direction
      ? "direction-" + this.props.direction
      : "";
    let className = this.props.className ? this.props.className : "";
    let subClassName = this.props.subClassName ? this.props.subClassName : "";
    if (this.props.type == "onlyIcon") {
      return (
        <div
          className={`select-dropdown-main-only-icon ${
            this.props.styleMode || "darkMode"
          } ${this.state.open ? "is-active" : ""}`}
        >
          <div className={`dropdown-trigger-only-icon`}>
            {this.renderToggle()}
          </div>
          <div
            id="select-dropdown-main-only-icon-wrap"
            ref={this.dropdownWrap}
            className={`dropdown-menu-only-icon ${direction} ${subClassName}`}
          >
            <div
              className="dropdown-content-only-icon"
              onClick={this.onBodyClick}
            >
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={`dropdown select-dropdown-main ${
          this.state.open ? "is-active" : ""
        } ${this.props.menuWidth ? `width-${this.props.menuWidth}` : ""} 
        ${
          this.props.buttonWidth ? `button-width-${this.props.buttonWidth}` : ""
        }
        ${className}`}
      >
        <div className={`dropdown-trigger`}>{this.renderToggle()}</div>
        <div
          className={`dropdown-menu ${direction} ${subClassName}`}
          role="menu"
        >
          <div className="dropdown-content" onClick={this.onBodyClick}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  };
}

export default onClickOutside(Dropdown);
