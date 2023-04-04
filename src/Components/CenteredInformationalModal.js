import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

import styles from "./CenteredInformationalModal.scss";

import modal_close from "assets/images/modal-x.svg";

/*
  props:
    - title str: str to be written bolded
		- text str: str to be written
		- image svg: image to be placed on the middle
    - onHide function([obj]): to be called when modal is closed or hided
    - show bool: attribute to show or not the modal
*/

class CenteredInformationalModal extends Component {
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
          <span>
            <img
              src={modal_close}
              alt="close button"
              id="close-x"
              onClick={this.props.onHide}
            />
          </span>
          <img id="image-icon" src={this.props.image} alt="props icon" />
          <h5 className="has-text-black-bis">{this.props.title}</h5>
          <p className="has-text-black-bis">{this.props.text}</p>
        </Modal.Body>
      </Modal>
    );
  };
}

export default CenteredInformationalModal;
