import React, { Component } from "react";

import onClickOutside from "react-onclickoutside";


import './styles.scss';

/*
	props:
    - position: 'left'|'right'|'center'
		- title str: dropdown button text
		- hideOnBodyClick bool false: Determine whether to hide the drowpdown when an option is clicked
	
*/

const positionToBulmaClassName = {
  'left': 'is-left',
  'right': 'is-right',
  'center': 'is-center'
}

class Dropdown extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClickOutside = (evt) => {
    if (this.props.hideOnClickOutside === false) return;
    this.setState({ open: false });
  };

  onBodyClick = () => {
    if (this.props.hideOnBodyClick !== true) return;
    this.setState({ open: false });
  };

  onTriggerClick = () => {

    this.setState({ open: !this.state.open })

  }

  renderTriggerProp = () => {

    let triggerComponent = this.props.triggerComponent;

    // check if its a Reactjs element
    if (React.isValidElement(triggerComponent)) {

      let element =  React.createElement(
        triggerComponent.type,
        {
          ...triggerComponent.props,
          onClick: () => { 

            this.onTriggerClick();
            if (typeof triggerComponent.props.onClick == 'function')
              triggerComponent.props.onClick()

          }
        }
      )

      return element;
    } else {

      throw new Exception('Not supported TriggerComponent')

    }
  }

  renderTriggerComponent = () => {

    if (this.props.triggerComponent) {

      return this.renderTriggerProp();

    } else {

      return (
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={ this.onTriggerClick }
          >
            <p className="r">{this.props.title}</p>
            <span className="icon is-small">
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
      );

    }
  };

  render = () => {

    const bulmaClassNamePositions = (this.props.position in positionToBulmaClassName ? positionToBulmaClassName[this.props.position] : '');

    return (
      <div
        className={`dropdown treble-component ${
          this.state.open ? "is-active" : ""
        } ${this.props.menuWidth ? `width-${this.props.menuWidth}` : ""} ${this.props.className}
          ${bulmaClassNamePositions}
        ` }
      >
        { this.renderTriggerComponent() }
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content" onClick={this.onBodyClick}>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }

}

export default onClickOutside(Dropdown);
