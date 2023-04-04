import React from "react";
import "./CustomModal.scss";

const CustomModal = (props) => {
  const renderTitle = () => {
    if (!props.title) return;
    return <h6>{props.title}</h6>;
  };
  const renderModal = () => {
    if (props.show) {
      return (
        <div className={`treble-custom-modal ${props.class}`}>
          <div className="whole-modal">
            <div className="custom-modal-header"
            >
              {renderTitle()}
              <div
                className={`close-icon icon--${props.closeIcon}`}
                onClick={(e) => {
                  props.onClose();
                }}
              />
            </div>
            <div className="custom-modal-body">{props.body}</div>
            <div className="custom-modal-buttons">{props.buttons}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return renderModal();
};

export default CustomModal;