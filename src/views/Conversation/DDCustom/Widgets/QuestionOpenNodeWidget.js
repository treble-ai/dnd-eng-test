import React from "react";
import $ from "jquery";
import "./styles-v2.scss";
import Switch from "../../../../Components/Switch";
import Textarea from "react-textarea-autosize";
import FileViewer from "react-file-viewer";
import SelectDropdown from "Components/SelectDropdown";
import Modal from "@bit/treble.components.modal";
import Alert from "@bit/treble.components.alert";
import TextInput from "Components/TextInput";
import { GoogleMapsSearchBar, TrebleMapPointer } from "Components/GoogleMaps";
import ChangeQuestionType from "views/Conversation/ChangeQuestionType";
import HelpdeskPropertySelector from "Components/HelpdeskPropertySelector";

import GoogleMapReact from "google-map-react";

import InputPortWidget from "./InputPortWidget";
import AnswerPortWidget from "./AnswerPortWidget";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import ImageTooltip from "../../ImageTooltip";
import events from "utils/events";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
import { DEFAULT_LOCATION, DEFAULT_ZOOM, FOUND_ZOOM } from "./constants.js";
const language = languages[getLanguage()];

const QUESTION_PLACEHOLDER = language.write;
const ALT_PORT_LABEL = language.altFlux;

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_MAPS_LANGUAGE = process.env.REACT_APP_GOOGLE_MAPS_LANGUAGE;

export class QuestionOpenNodeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.renderNotAnswerTimeoutPort =
      this.renderNotAnswerTimeoutPort.bind(this);
    this.onToggleSwitch = this.onToggleSwitch.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.changeDrag = this.changeDrag.bind(this);

    const propsVariableFile = props.node.getVariableFile();

    this.state = {
      loadingFile: false,
      canDrag: false,
      variableFileModal: false,
      variableFile: propsVariableFile ? propsVariableFile : "",
      mapModal: false,
      mapsApiLoaded: false,
    };
  }

  onToggleSwitch(newState) {
    const { node, diagramEngine } = this.props;
    node.setHasNotAnswerTimeoutPort(newState);
    diagramEngine.forceUpdate();
    this.forceUpdate();
  }

  onFileSelect(event) {
    const { node, diagramEngine } = this.props;

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

    this.setState({ loadingFile: true });

    const self = this;

    $.ajax({
      url: `https://api.cloudinary.com/v1_1/treble-ai/${fileType}/upload`,
      data: formData,
      type: "POST",
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      success: function (data) {
        const { secure_url, original_filename } = data;

        node.addMedia(secure_url, fileType, original_filename);

        self.setState({ loadingFile: false });

        diagramEngine.forceUpdate();
      },
      error: function (data) {
        alert("Unable to upload file");
        self.setState({
          loadingFile: false,
        });
      },
    });
  }

  renderInputPort() {
    const { node } = this.props;

    const port = node.getInPort();

    if (!port) return;

    return <InputPortWidget name={port.name} port={port} />;
  }

  deleteMedia(node, diagramEngine) {
    node.deleteMedia();
    diagramEngine.forceUpdate();
  }

  renderMediaContainer() {
    const { node, diagramEngine } = this.props;
    if (
      !this.state.loadingFile &&
      (!node.file || (!node.getMediaUrl() && !node.getVariableFile()))
    )
      return;

    const file_url = node.getMediaUrl();
    const file_type = node.getMediaType();
    const file_name = node.getMediaFilename();
    const file_variable = node.getVariableFile();

    let containerContent = null;

    if (file_type == "image") {
      containerContent = (
        <div>
          <img src={file_url} />
          <button
            className="del-btn"
            onClick={(e) => this.deleteMedia(node, diagramEngine)}
          >
            <i className="icon icon--trash"></i>
          </button>
        </div>
      );
    }
    if (file_type == "video") {
      containerContent = (
        <div>
          <video
            controls
            src={file_url}
            controlsList="nofullscreen nodownload noremoteplayback"
          />
          <button
            className="del-btn"
            onClick={(e) => this.deleteMedia(node, diagramEngine)}
          >
            <i className="icon icon--trash"></i>
          </button>
        </div>
      );
    }
    if (file_type == "raw") {
      let splitUrl = file_url.split(".");
      let fileExt = splitUrl[splitUrl.length - 1];
      let supportedExt = ["pdf", "csv", "xlsx", "docx"];
      if (!supportedExt.includes(fileExt)) {
        fileExt = "other-extension";
      }
      let sheetExt = ["csv", "xlsx"];

      class UnsupportedExtensionComponent extends React.Component {
        render() {
          return <i className="icon icon--unsupported-extension"></i>;
        }
      }

      containerContent = (
        <div className="file-previewer">
          <FileViewer
            fileType={sheetExt.includes(fileExt) ? null : fileExt}
            filePath={file_url}
            unsupportedComponent={UnsupportedExtensionComponent}
          />
          <div className="file-info">
            <i className={`icon icon--${fileExt}`}></i>
            <a href={file_url} target="_blank">
              {file_name}
            </a>
          </div>
          <button
            className="del-btn"
            onClick={(e) => this.deleteMedia(node, diagramEngine)}
          >
            <i className="icon icon--trash"></i>
          </button>
        </div>
      );
    }
    if (this.state.loadingFile) {
      containerContent = <div className="m-loader m-loader--danger"></div>;
    }
    if (file_variable !== undefined && file_variable !== "") {
      containerContent = (
        <div className="variable-file">
          <div className="variable-file-icon">
            <i className="icon icon--unsupported-extension"></i>
          </div>
          <div className="variable-file-name">
            <i className={`icon icon--other-extension`}></i>
            <p>{`{{${file_variable}}}`}</p>
          </div>
          <button
            className="del-btn"
            onClick={(e) => {
              this.deleteMedia(node, diagramEngine);
              this.setState({ variableFile: "" });
            }}
          >
            <i className="icon icon--trash"></i>
          </button>
        </div>
      );
    }

    return <div className="question-node--media">{containerContent}</div>;
  }

  renderAnswerOpenPort() {
    const { node } = this.props;
    const answerOpenPort = node.getAnswerOpenPort();

    if (!answerOpenPort) return null;

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={answerOpenPort}
        key={answerOpenPort.getID()}
      />
    );
  }

  onDragEnd(result, node) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    node.movePortFromToIndex(result.source.index, result.destination.index);
    this.setState({ canDrag: false });
    this.props.diagramEngine.forceUpdate();
  }

  changeDrag(newDrag) {
    this.setState({ canDrag: newDrag });
  }

  renderAnswerClosedPorts() {
    const { node } = this.props;

    if (typeof node.getOrderedClosedPorts !== "function") return;

    const answerClosedPorts = node.getOrderedClosedPorts();
    if (!answerClosedPorts.length) return null;
    return (
      <DragDropContext
        onDragEnd={(result) => this.onDragEnd(result, node)}
        onDragUpdate={() => this.props.diagramEngine.forceUpdate()}
      >
        <Droppable
          droppableId={`answer-closed-port-container-${node.getID()}`}
          key={`answer-closed-port-container-${node.getID()}`}
          renderClone={(provided, snapshot, rubric) => (
            <div id="dragging-answer-port">
              <AnswerPortWidget
                diagramEngine={this.props.diagramEngine}
                port={answerClosedPorts[rubric.source.index]}
                key={answerClosedPorts[rubric.source.index].getID()}
                innerRef={provided.innerRef}
                provided={provided}
                style={provided.draggableProps.style}
              />
            </div>
          )}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              key={`answer-closed-port-container-div-${node.getID()}`}
            >
              {answerClosedPorts.map((port, index) => (
                <Draggable
                  draggableId={`answer-closed-port-${port.getID()}`}
                  index={index}
                  key={`answer-closed-port-${port.getID()}`}
                  isDragDisabled={this.props.hsm ? true : !this.state.canDrag}
                >
                  {(provided, snapshot) => (
                    <AnswerPortWidget
                      diagramEngine={this.props.diagramEngine}
                      port={port}
                      key={port.getID()}
                      innerRef={provided.innerRef}
                      provided={provided}
                      changeDrag={this.changeDrag}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  renderNotAnswerTimeoutPort() {
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

  renderAlternateFlowContainer() {
    const { node } = this.props;
    return (
      <div className="alt-port-container flex">
        <div className="alt-port-controller">
          <ImageTooltip
            imageName="alt_flux"
            title={language.altFlux}
            message={language.altFluxMsg}
            itemtohover={<div className="icon icon--info" />}
            placement="bottom"
            onToggle={(show) => {
              if (show) events.track("Hover on alternate flow help");
            }}
          />

          {ALT_PORT_LABEL}
          <span className="fill" />
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <Switch
              active={Boolean(node.getNotAnswerTimeoutPort())}
              onChange={this.onToggleSwitch}
            />
          </div>
        </div>
        {this.renderNotAnswerTimeoutPort()}
      </div>
    );
  }

  renderTextarea() {
    const { node } = this.props;
    const fileInputId =
      "question-node-widget-inpt-file-attach-" + this.props.node.getID();

    if (this.props.hsm) {
      return (
        <Textarea
          placeholder={QUESTION_PLACEHOLDER}
          value={node.getText()}
          onChange={(e) => {
            node.setText(e.target.value);
            e.stopPropagation();
            this.forceUpdate();
          }}
        />
      );
    } else {
      let attachmentOptions = [
        {
          display: language.gallery,
          icon: "image",
          uploader: (
            <input
              type="file"
              accept="image/*, video/*, video/mp4,video/x-m4v"
              id={fileInputId + "-gallery"}
              onChange={this.onFileSelect}
            />
          ),
          label: "-gallery",
        },
        {
          display: language.documents,
          icon: "other-extension",
          uploader: (
            <input
              type="file"
              accept="application/*, .docx"
              id={fileInputId + "-document"}
              onChange={this.onFileSelect}
            />
          ),
          label: "-document",
        },
        {
          display: language.location,
          icon: "map-pin",
          uploader: <></>,
          label: "-map",
        },
        {
          display: language.variable,
          icon: "variable-bracket white",
          uploader: <></>,
          label: "-variable",
        },
      ];
      return (
        <>
          <Textarea
            placeholder={QUESTION_PLACEHOLDER}
            value={node.getText()}
            onChange={(e) => {
              e.stopPropagation();
              node.setText(e.target.value);
              this.forceUpdate();
            }}
          />
          <div>
            {this.props.hasHubspotIntegration && (
              <HelpdeskPropertySelector
                language={language}
                searchPlaceholder={language.searchByNamePH}
                onSelect={(e) => {
                  node.setText(`${node.getText()} {{hubspot_${e.value}}}`);
                  this.forceUpdate();
                }}
              />
            )}
            <div className="btn-add-file">
              <SelectDropdown
                options={attachmentOptions}
                triggerComponent={
                  <i className="icon icon--clip size-16 clickable"></i>
                }
                display={(item) => (
                  <label htmlFor={fileInputId + item.label}>
                    <div className="">
                      <i className={`icon icon--${item.icon} size-16`}></i>
                      {item.display}
                    </div>
                    {item.uploader}
                  </label>
                )}
                onSelect={(item) => {
                  if (item.label == "-map") {
                    this.setState({ mapModal: true });
                  }
                  if (item.label == "-variable") {
                    this.setState({ variableFileModal: true });
                  }
                }}
              />
            </div>
          </div>
        </>
      );
    }
  }

  renderSearchBox = () => {
    if (!this.state.mapsApiLoaded) return;
    return (
      <GoogleMapsSearchBar
        onPlaceLoaded={(place) => {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.props.node.setLocationCoordinates(
            lat,
            lng,
            place.formatted_address
          );
          this.forceUpdate();
        }}
        onChange={(e) => {
          this.props.node.setLocationAddress(e.target.value);
          this.forceUpdate();
        }}
      />
    );
  };

  renderMarker = () => {
    let nodeLocation = this.props.node.getLocation();
    if (!nodeLocation) return;
    return <TrebleMapPointer lat={nodeLocation.lat} lng={nodeLocation.lng} />;
  };

  resetMapsConfiguration = () => {
    this.props.node.deleteLocation();
    this.setState({
      mapModal: false,
      mapsApiLoaded: false,
    });
  };

  renderVariableFileModal = () => {
    if (!this.state.variableFileModal) return;
    const resetVariableFile = () => {
      this.setState({ variableFileModal: false, variableFile: "" });
    };
    const saveAndClose = () => {
      const { node } = this.props;
      const formatVariable = () => {
        const variableRegex = /{{\w+}}/g;
        return variableRegex.test(this.state.variableFile)
          ? this.state.variableFile.replace(/{|}/gi, "")
          : `${this.state.variableFile}`;
      };
      node.setVariableFile(formatVariable(this.state.variableFile));
      this.setState({
        variableFileModal: false,
      });
    };

    return (
      <Modal
        show={this.state.variableFileModal}
        onClose={resetVariableFile}
        title={language.variableFile}
        body={
          <div className="variable-file-modal">
            <div className="field">
              <div className="control">
                <TextInput
                  className="input"
                  placeholder={language.variableFilePlaceholder}
                  type="text"
                  onChange={(e) =>
                    this.setState({ variableFile: e.target.value })
                  }
                  value={this.state.variableFile}
                />
              </div>
            </div>
          </div>
        }
        buttons={[
          {
            onClick: resetVariableFile,
            body: language.cancel,
          },
          {
            onClick: saveAndClose,
            body: language.save,
          },
        ]}
      />
    );
  };

  renderMapModal = () => {
    const { node } = this.props;
    let nodeLocation = node.getLocation();
    if (!this.state.mapModal) return;

    // Clean the {{VARIABLE}} of treble into just the text to be displayed/saved that way, without the {{ }}
    const cleanVariable = () => {
      const variableRegex = /{{\w+}}/g;
      return variableRegex.test(nodeLocation.address)
        ? nodeLocation.address.replace(/{|}/gi, "")
        : null;
    };

    // Save the information of the location into the node
    const saveAndCloseState = () => {
      /*
      There are currently two uses cases for this location feature. Either the user inputs a valid address and selects it or the user inputs a treble variable for us to replace and send
      Case Address:
        The user selects a valid address and thus we want to save the latitude/longitude of it (mapsCenter) and the treble variable is null
      Case treble variable:
        The user inputs a treble variable and thus we want to save the latitude/longitude as null and the treble variable without the {{ }} characters.
      In both cases we save the wirtten input in the searchbar (mapsAddress) 
      */
      node.setLocation(
        { lat: nodeLocation.lat, lng: nodeLocation.lng },
        cleanVariable(),
        nodeLocation.address
      );
      this.setState({
        mapModal: false,
      });
    };

    const decideRender = () => {
      if (nodeLocation?.address.includes("{")) {
        return (
          <Alert
            show={true}
            type={"warning"}
            title={language.locationVariableTitle}
            description={language.locationVariable}
          />
        );
      } else {
        return (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GOOGLE_API_KEY,
              language: GOOGLE_MAPS_LANGUAGE,
              libraries: ["places"],
            }}
            center={
              nodeLocation
                ? { lat: nodeLocation.lat, lng: nodeLocation.lng }
                : DEFAULT_LOCATION
            }
            zoom={nodeLocation ? FOUND_ZOOM : DEFAULT_ZOOM}
            onGoogleApiLoaded={() => {
              this.setState({
                mapsApiLoaded: true,
              });
            }}
          >
            {this.renderMarker()}
          </GoogleMapReact>
        );
      }
    };

    return (
      <Modal
        show={this.state.mapModal}
        onClose={this.resetMapsConfiguration}
        title={"Ubicación"}
        body={
          <div className="maps-modal">
            <div className="direction-input">
              {language.address}
              {this.renderSearchBox()}
            </div>
            <div className="map-container">{decideRender()}</div>
          </div>
        }
        buttons={[
          {
            onClick: this.resetMapsConfiguration,
            body: language.cancel,
          },
          {
            onClick: saveAndCloseState,
            body: language.save,
          },
        ]}
      />
    );
  };

  renderMap = () => {
    const { node } = this.props;
    let nodeLocation = node.getLocation();
    if (!nodeLocation || !nodeLocation.address) return;

    const renderValidMap = () => {
      return (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GOOGLE_API_KEY,
            language: GOOGLE_MAPS_LANGUAGE,
            libraries: ["places"],
          }}
          center={{ lat: nodeLocation.lat, lng: nodeLocation.lng }}
          zoom={FOUND_ZOOM}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            this.setState({
              mapsApiLoaded: true,
            });
            map.setOptions({ draggable: false });
          }}
        >
          {this.renderMarker()}
        </GoogleMapReact>
      );
    };

    const renderTemplateMap = () => {
      return <div className="icon--template-google-map"></div>;
    };

    const decideRender = () => {
      const variableRegex = /{{\w+}}/g;
      return variableRegex.test(nodeLocation.address)
        ? renderTemplateMap()
        : renderValidMap();
    };

    return (
      <div className="question-node--media">
        <div className="map-container">{decideRender()}</div>
        <div className="file-info">
          <i className={`icon icon--map-pin`}></i>
          <p>{nodeLocation.address}</p>
        </div>
        <button
          className="del-btn"
          onClick={(e) => this.resetMapsConfiguration()}
        >
          <i className="icon icon--trash"></i>
        </button>
      </div>
    );
  };

  render() {
    const { node } = this.props;

    const { color } = node;
    const style = {};
    if (color) {
      style.background = color;
    }

    return (
      <div className="whole-question-container">
        <ChangeQuestionType
          diagramEngine={this.props.diagramEngine}
          node={node}
          forceUpdate={this.forceUpdate.bind(this)}
        />
        <div
          className="question-node-v2 node-v2"
          id="question-node-open"
          data-nodeid={node.getID()}
        >
          <div className="textarea-wrapper">
            {this.renderInputPort()}
            {this.renderMediaContainer()}
            {this.renderMap()}
            {this.renderTextarea()}
            {this.renderAnswerOpenPort()}
          </div>
          <hr />
          {this.renderAlternateFlowContainer()}
          {this.renderMapModal()}
          {this.renderVariableFileModal()}
        </div>
      </div>
    );
  }
}
