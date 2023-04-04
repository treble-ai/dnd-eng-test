import React from "react";
import { Modal } from "antd";
import { Typewriter } from "react-simple-typewriter";
import TrebleIcon from "Components/TrebleIcon";

import "./InformationModal.scss";

const InformationModal = (props) => {
  const renderCTA = () => {
    return (
      <div className="treble-cta">
        <div className="front-cta" onClick={props.ctaClick}>
          {props.ctaText}
        </div>
        <div className="back-cta" />
      </div>
    );
  };

  const renderTyping = () => {
    return (
      <div className="treble-typing">
        <Typewriter
          words={props.texts}
          cursor
          cursorStyle="|"
          typeSpeed={130}
        />
      </div>
    );
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onClose}
      maskStyle={{ background: "rgba(10, 11, 43, 0.2)" }}
      wrapClassName="treble-information-modal"
      footer={null}
    >
      <div className="treble-container">
        <TrebleIcon name="cat" />
        <div className="treble-right">{renderTyping()}</div>
      </div>
      {renderCTA()}
    </Modal>
  );
};

export default InformationModal;
