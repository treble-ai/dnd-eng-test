import React from "react";
import $ from "jquery";
import "./styles.scss";
import Switch from "../../../../Components/Switch";
import Textarea from "react-textarea-autosize";

import InputPortWidget from "./InputPortWidget";
import AnswerPortWidget from "./AnswerPortWidget";

const QUESTION_PLACEHOLDER = "Click para escribir...";

export class QuestionNodeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingAttr: false,
      loadingFile: false,
    };

    this.onLargeFileHandler = this.onLargeFileHandler.bind(this);
    this.onFileURL = this.onFileURL.bind(this);
    this.onFileUploadStart = this.onFileUploadStart.bind(this);
    this.onToggleSwitch = this.onToggleSwitch.bind(this);
    this.isSwitchActive = this.isSwitchActive.bind(this);
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
  }

  static defaultProps = {
    node: null,
    color: "rgb(224, 98, 20)",
  };

  remove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  //////////. FILE HANDLERS /////////
  onFileURL(url, type) {
    const { node, diagramEngine } = this.props;
    node.file.url = url;
    node.file.type = type;
    this.setState({
      loadingFile: false,
    });
    diagramEngine.forceUpdate();
  }
  onLargeFileHandler() {
    alert("File is too large to handle");
    this.setState({
      loadingFile: false,
    });
  }
  onFileUploadStart() {
    this.setState({
      loadingFile: true,
    });
  }

  ///////////////////////////////////

  getAnswerClosedAndOpenPorts() {
    const { node } = this.props;
    const answerOpenPort = node.getAnswerOpenPort();

    let ports = [];

    if (answerOpenPort) ports = [answerOpenPort];
    else ports = node.getAnswerClosedPorts();

    return ports.map((port) => (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={port}
        key={port.getID()}
      />
    ));
  }

  getNotAnswerTimeoutPort() {
    const { node } = this.props;
    const timeoutPort = node.getNotAnswerTimeoutPort();

    if (!timeoutPort) return null;

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={timeoutPort}
        key={timeoutPort.getID()}
      />
    );
  }

  getInputAnswer() {
    const { node, color, displayOnly } = this.props;

    const allPorts = node.getAllPorts();

    const ports = Object.values(allPorts).filter(
      (elem) => elem.name === "input"
    );
    const port = ports[0];

    return <InputPortWidget name={port.name} port={port} />;
  }

  addAnswer() {
    const { node, diagramEngine } = this.props;

    node.addAnswerClosedPort();

    diagramEngine.forceUpdate();
  }

  renderQuestionText() {
    const { node } = this.props;

    return (
      <Textarea
        placeholder={QUESTION_PLACEHOLDER}
        value={node.getText()}
        type="text"
        className="answer-input"
        onFocus={() => (this.props.node.editing = true)}
        onBlur={() => (this.props.node.editing = false)}
        onChange={(e) => {
          node.setText(e.target.value);
          e.stopPropagation();
          this.forceUpdate();
        }}
        ref={(input) => (this.questionName = input)}
      ></Textarea>
    );
  }

  renderAttrOption() {
    const { node } = this.props;

    if (this.state.editingAttr) {
      setTimeout(() => {
        if (this.inputTag) {
          this.inputTag.focus();
        }
      }, 50);

      return (
        <div className="header--edit attr">
          <input
            type="text"
            className="answer-input"
            onBlur={() => this.setState({ editingAttr: false })}
            onChange={(e) => (node.attr = e.target.value)}
            ref={(input) => (this.inputTag = input)}
          ></input>
        </div>
      );
    } else {
      let attr_icon = <i className="flaticon-signs"></i>;
      if (node.attr != "") attr_icon = <p>{node.attr}</p>;
      return (
        <div
          className="header--edit attr"
          onClick={() => this.setState({ editingAttr: true })}
        >
          {attr_icon}
        </div>
      );
    }
  }

  renderMediaContainer() {
    const { node } = this.props;
    if (!this.state.loadingFile && (!node.file || !node.file.url)) return;
    const file_url = node.file.url;
    const file_type = node.file.type;

    let container_content = null;

    if (file_type == "image") {
      container_content = <img src={file_url} />;
    }
    if (file_type == "video") {
      container_content = (
        <video
          controls
          src={file_url}
          controlsList="nofullscreen nodownload noremoteplayback"
        />
      );
    }
    if (this.state.loadingFile) {
      container_content = <div className="m-loader m-loader--danger"></div>;
    }

    return <div className="question-node--header">{container_content}</div>;
  }

  onToggleSwitch(newState) {
    const { node, diagramEngine } = this.props;

    this.setState({
      is_switch_active: newState,
    });

    if (newState) {
      const { node, color, displayOnly, diagramEngine } = this.props;
      node.addNotAnswerTimeoutPort();
      diagramEngine.forceUpdate();
    } else {
      const port = node.getNotAnswerTimeoutPort();
      node.removePort(port);
      diagramEngine.forceUpdate();
    }
    this.forceUpdate();
  }

  isSwitchActive() {
    const { node, diagramEngine } = this.props;
    return node.getNotAnswerTimeoutPort() ? true : false;
  }

  onChange(event) {
    var file = event.target.files[0];
    let fileType;
    let uploadPreset;
    if (file.type.includes("image")) {
      fileType = "image";
      uploadPreset = "cynylbbf";
      if (file.type.includes("webp")) {
        uploadPreset = "same_type";
      }
    } else if (file.type.includes("video")) {
      fileType = "video";
      uploadPreset = "ohxrsgfm";
    } else {
      fileType = "raw";
      uploadPreset = "same_type";
    }

    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    this.onFileUploadStart();

    const self = this;

    $.ajax({
      url: `https://api.cloudinary.com/v1_1/treble-ai/${fileType}/upload`,
      data: formData,
      type: "POST",
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      success: function (data) {
        console.log(data);
        const { url } = data;
        self.onFileURL(url, fileType);
      },
      error: function (data) {
        alert("Unable to upload file");
        self.setState({
          loadingFile: false,
        });
      },
    });
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }

    const file_input_id =
      "question-node-widget-inpt-file-attach" + this.props.node.id;
    return (
      <div className="question-node node" data-nodeid={node.getID()}>
        <div className="actions-buttons">
          {this.renderAttrOption()}
          <div className="header--edit">
            <label htmlFor={file_input_id}>
              <i className="flaticon-attachment">
                <input
                  type="file"
                  accept="image/*, video/*, video/mp4,video/x-m4v"
                  id={file_input_id}
                  onChange={this.onChange}
                />
              </i>
            </label>
          </div>
          <div className="header--edit trash">
            <i className="flaticon-circle" onClick={this.remove}></i>
          </div>
        </div>
        {this.renderMediaContainer()}
        <div
          className="question-node--header question-node--header--title"
          onDoubleClick={() => this.setState({ editing: true })}
        >
          {this.renderQuestionText()}
        </div>
        <div className="question-node--body">
          {this.getInputAnswer()}
          {this.getAnswerClosedAndOpenPorts()}
          <div
            className="question question--add"
            onClick={() => this.addAnswer()}
          >
            <p>Agregar Respuesta +</p>
          </div>
          <hr />
          <p className="label">
            Programar flujo alterno
            <div className="icon icon--info" />
            <Switch
              active={this.isSwitchActive()}
              onChange={this.onToggleSwitch}
            />
          </p>
          {this.getNotAnswerTimeoutPort()}
        </div>
      </div>
    );
  }
}
