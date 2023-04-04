import React, { Fragment } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

import "./AnnouncementModal.scss";
import languages from "./../languages.js";

const AnnouncementModal = (props) => {
  /**
   * Props of this component.
   * @param {string} imgName - The name of the image with its extension, the file must be load in assets/images folder
   * @param {string} ctaClick - The target function we want to be executed with the announcement, we'll show the modal until user click on it
   * @param {string} onClose - The function is called when the modal is closed
   * @param {string} ctaText - The text showed on the button that call ctaClick
   * @param {HTMLElement} body - The body for the component.
   * @param {HTMLElement} header - The header for the component
   * @param {HTMLElement} customFooter - The footer for the component
   * @param {Array} buttons - An array of objects whit the text and functions for the footer
   * @param {string} overTitle - A text to show over the main title
   * @param {string} title - The title of the body
   * @param {Array} texts - An array with the texts that will be showed on the body
   * @param {string} language - one of this: [en, es, pt]
   */

  const strings = languages[props.language] || languages["en"];

  const defaultButtons = [
    { onClick: null, text: strings.yes, classButton: "YesButton" },
    { onClick: null, text: strings.no, classButton: "NoButton" },
    { onClick: null, text: strings.cancel, classButton: "CancelButton" },
  ];
  const src = require(`assets/images/${strings.announcementModalImgName}`);
  const renderCTA = () => {
    return (
      <div className="treble-cta" onClick={props.ctaClick}>
        <div className="front-cta">{props.ctaText}</div>
      </div>
    );
  };

  const renderHeader = (header) => {
    if (header) {
      return <div className="header">{header}</div>;
    } else {
      // default header
      return;
    }
  };

  const renderBody = (body) => {
    if (body) {
      return (
        <>
          <div className="content-container">{body}</div>
          <div className="image-container">
            <img src={src} />
          </div>
        </>
      );
    } else {
      // default body
      return (
        <>
          <div className="content-container">
            <div>
              <h6 className="over-title">{props.overTitle}</h6>
              <h5 className="title">{props.title}</h5>
              <p className="content-paragraph">{props.texts[0]}</p>
            </div>
            {renderCTA()}
          </div>
          <div className="image-container">
            <img src={src} />
          </div>
        </>
      );
    }
  };

  const renderFooter = (customFooter) => {
    if (customFooter !== false) {
      return <Fragment>{customFooter}</Fragment>;
    } else {
      // default footer as example

      const buttonsList = props.buttons || defaultButtons;

      return (
        <div className="footer">
          {buttonsList.map(({ onClick, text, classButton }) => (
            <button className={classButton} onClick={onClick}>
              {text}
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onClose}
      wrapClassName="treble-announcement-modal"
      footer={null}
    >
      {renderHeader(props.header)}
      <div id="main-container">{renderBody(props.body)}</div>
      {renderFooter(props.customFooter)}
    </Modal>
  );
};


export default AnnouncementModal;
