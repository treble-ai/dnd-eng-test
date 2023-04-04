import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

import styles from "./CenteredModalWithButtons.scss";

/*
  props:
    - title str: str to be written bolded
		- text str: str to be written
		- image svg: image to be placed on the middle
    - onHide function([obj]): to be called when modal is closed or hided
    - show bool: attribute to show or not the modal
*/

class CenteredModalWithButtons extends Component {
  typeOfButton = (btn) => {
    if (btn.ref) {
      return (
        <Link key={btn.key} to={btn.ref}>
          <button
            type="button"
            className={`btn btn--${btn.color}`}
            onClick={btn.onClick}
          >
            <p className="is-family-secondary l">{btn.name}</p>
          </button>
        </Link>
      );
    } else {
      return (
        <button
          type="button"
          key={btn.key}
          onClick={btn.onClick}
          className={`btn btn--${btn.color}`}
        >
          <h6 className="is-family-secondary">{btn.name}</h6>
        </button>
      );
    }
  };

  render = () => {
    let onHide = this.props.onHide;

    if (typeof onHide !== "function") onHide = () => {};

    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.show}
        onHide={this.props.onHide}
        dialogClassName="modal-centered"
        styles={styles}
      >
        <Modal.Body>
          <p className="is-family-primary l has-text-black-bis">
            {this.props.text}
          </p>
          <div className="button-row">
            {this.typeOfButton(this.props.buttons[0])}
            {this.typeOfButton(this.props.buttons[1])}
          </div>
        </Modal.Body>
      </Modal>
    );
  };
}

export default CenteredModalWithButtons;
