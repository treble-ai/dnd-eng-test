import React, { Component } from "react";

import _ from "lodash";

import domtoimage from "dom-to-image-more";
import queryString from "query-string";
import moment from "moment";

import SelectDropdown from "Components/SelectDropdown";
import Modal from "@bit/treble.components.modal";
import CustomModal from "Components/CustomModal";
import InlineAlert from "@bit/treble.components.inline-alert";
import Toaster from "@bit/treble.components.toaster";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip as BootstrapTooltip } from "react-bootstrap";
import TextInput from "Components/TextInput";
import InputTextarea from "Components/InputTextarea";
import NewComponentPill from "Components/NewComponentPill";
import TrebleLoader from "Components/TrebleLoader";

import {
  DiagramWidget,
  DiagramEngine,
  DefaultNodeModel,
  DefaultLinkFactory,
  DefaultPortInstanceFactory,
  LinkInstanceFactory,
} from "DDCanvas/main";

import { zoomToContent } from "DDCanvas/widgets/DiagramWidgetUtils";

import {
  AnswerPortModel,
  ANSWER_PORT_TYPE_OPEN,
  ANSWER_PORT_TYPE_CLOSED,
  ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
  ANSWER_PORT_TYPE_TIMEOUT,
} from "./DDCustom/Models/AnswerPortModel";

import {
  QuestionOpenWidgetFactory,
  QuestionClosedWidgetFactory,
  QuestionClosedButtonsWidgetFactory,
  QuestionClosedListWidgetFactory,
  ConditionalNodeWidgetFactory,
  ABNodeWidgetFactory,
  HSMWidgetFactory,
  AgentWidgetFactory,
  HubSpotAgentWidgetFactory,
  FreshdeskAgentWidgetFactory,
  ZendeskAgentWidgetFactory,
  KustomerAgentWidgetFactory,
  CustomAgentWidgetFactory,
  IntercomAgentWidgetFactory,
  PollRedirectionWidgetFactory,
  HelpdeskActionNodeWidgetFactory,
  HelpdeskTicketNodeWidgetFactory,
  QuestionOpenNodeModel,
  QuestionClosedNodeModel,
  QuestionClosedButtonsNodeModel,
  QuestionClosedListNodeModel,
  QuestionNodeModel,
  ConditionalNodeModel,
  ABNodeModel,
  HSMNodeModel,
  AgentNodeModel,
  HubSpotAgentNodeModel,
  FreshdeskAgentNodeModel,
  ZendeskAgentNodeModel,
  KustomerAgentNodeModel,
  CustomAgentNodeModel,
  IntercomAgentNodeModel,
  PollRedirectionNodeModel,
  HelpdeskActionNodeModel,
  HelpdeskTicketNodeModel,
} from "views/Conversation/DDCustom/main";

import {
  QuestionNodeFactory,
  QuestionOpenNodeFactory,
  QuestionClosedNodeFactory,
  QuestionClosedButtonsNodeFactory,
  QuestionClosedListNodeFactory,
  ConditionalNodeFactory,
  ABNodeFactory,
  AgentNodeFactory,
  HubSpotAgentNodeFactory,
  FreshdeskAgentNodeFactory,
  ZendeskAgentNodeFactory,
  KustomerAgentNodeFactory,
  CustomAgentNodeFactory,
  IntercomAgentNodeFactory,
  HSMNodeFactory,
  PollRedirectionNodeFactory,
  HelpdeskActionNodeFactory,
  HelpdeskTicketNodeFactory,
} from "./DDCustom/InstanceFactories/NodeInstanceFactories";

import {
  AnswerPortFactory,
  ProbabilityPortFactory,
} from "./DDCustom/InstanceFactories/PortInstanceFactories";

import "./style.scss";
import languages from "./languages.js";
import events from "utils/events";
import requests from "utils/requests";

import backgroundImage from "assets/images/background-pointsV2.svg";
import iconHSMImage from "./images/IconHSM.svg";
import iconQuestionOpenImage from "./images/IconMessage.svg";
import iconQuestionClosedImage from "./images/IconQuestionClosed.svg";
import iconClosedButtons from "./images/IconClosedButtons.svg";
import iconClosedList from "./images/IconClosedList.svg";

import getLanguage from "getLanguage.js";

import iconLinkConversationImage from "./images/IconLinkConversation.svg";
import iconABTestingImage from "./images/IconABTesting.svg";
import iconHelpdeskActionImage from "./images/IconHelpdeskActionImage.svg";
import iconConditionalImage from "./images/IconConditional.svg";
import iconAgentImage from "./images/IconAgent.svg";
import iconTrebleImage from "./images/IconTreble.svg";
import iconSendEmailImage from "./images/IconSendEmail.svg";
import iconZendeskImage from "./images/IconZendesk.svg";
import iconKustomerImage from "./images/IconKustomer.svg";
import iconHubspotImage from "./images/IconHubspot.svg";
import iconFreshdesk from "views/Conversation/images/freshdesk.svg";
import iconZohoImage from "./images/IconZoho.svg";
import iconSalesforceImage from "./images/IconSalesforce.svg";
import iconPipedriveImage from "./images/IconPipedrive.svg";
import iconZapierImage from "./images/IconZapier.svg";
import iconCustomImage from "./images/IconCustom.svg";
import iconIntercomImage from "./images/Intercom.svg";
import iconHelpdeskTicketImage from "./images/IconHelpdeskTicket.svg";
import sheetsImage from "./images/sheetsImg.svg";

import ConfigurationPanel from "./ConfigurationPanelComponent.js";
import EvaluationModalsComponent from "./EvaluationModalsComponent.js";

import constants from "assets/constants.js";

// Ant Design
import { Menu, Dropdown, Tooltip, Radio, Slider } from "antd";
import "antd/dist/antd.css";
import ConversationEvaluation from "./ConversationEvaluation";

const { SubMenu } = Menu;

const BACKGROUND_IMAGE_WIDTH = 9;
const BACKGROUND_IMAGE_HEIGHT = 9;

const CURSOR_MODE_MOVE = "CURSOR_MODE_MOVE";
const CURSOR_MODE_SELECT = "CURSOR_MODE_SELECT";
const GOOGLE_SHEETS_URL = "docs.google.com/spreadsheets";

const language = languages[getLanguage()];
const me = {
  id: 0,
};

const DEFAULT_CONVERSATION_NAME = language.convName;

const translate_language = getLanguage().toUpperCase();
const mapTranslateLanguageToDBLanguage = {
  ES: "ES",
  EN: "EN",
  PR: "PT",
};
const DEFAULT_CONVERSATION_LANGUAGE =
  mapTranslateLanguageToDBLanguage[translate_language];
//Integration modals work with the state [integrationNameInLowerCase]Modal ex: hubspotModal

//! HARDCODED COMPANIES FROM Daniel 11/01/2023
const FORCE_GOAL_COMPANIES = [
  2797, 2809, 2833, 3195, 3293, 3294, 3295, 4513, 4942, 555, 8079, 8277, 8407,
];
const FORCE_GOAL_LABELS = ["MARKETING", "ACTIVATION", "RETENTION"];

//! HARDCODED COMPANIES FROM ENG-159
const CONVERSATION_LIBRARY_TEST_COMPANIES = [
  1, 360, 2834, 617, 9695, 9366, 5108, 682, 5800, 2797, 2809, 587, 272, 555,
  4942, 2899, 6229, 3095, 4777, 2137, 7978, 212, 2907,
];

let PAGE_NAME = "Drag and Drop";

let trackEvent = (name, options) => {
  events.track(name, {
    ...options,
    page: PAGE_NAME,
  });
};

export default class CreateConversation extends Component {
  constructor(props) {
    super(props);

    this.diagramEngine = new DiagramEngine();

    this.initializeDiagramEngine();

    this.state = {
      selectedLink: null,
      webhookText: "",
      cursor: CURSOR_MODE_MOVE,
      conversationName: DEFAULT_CONVERSATION_NAME,
      conversationLanguage: DEFAULT_CONVERSATION_LANGUAGE,
      openConversationConfiguration: false,
      editing: false,
      modifyingLinkWebhook: false,
      modalShow: false,
      selectedModal: "",
      customIntegrationName: "",
      customIntegrationDescription: "",
      validatedCustomIntegrationFields: false,
      validatedHubSpot: false,
      sheetsModal: false,
      sheetsModalMessage: "",
      helpdeskModal: false,
      helpdeskAPIKey: "",
      helpdeskHost: "",
      helpdeskEmail: "",
      helpdeskPhoneProperty: "",
      validateHelpdesk: false,
      createBtnDisabled: false,
      integrationType: null,
      googleSheetLink: "",
      googleSheetVariable: "",
      hubspotExtensionModal: false,
      searchbarHsm: "",
      showReloadPrompt: true,
      labelId: null,
      timezone: null,
      errorModal: null,
      pollGoal: null,
      modal: null,
      conversationEvaluationOpen: false,
      completeLoader: null,
      goalBlockModal: false,
      autoSave: "noDraft",
    };
    this.saveConversationDraft = this.saveConversationDraft.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.conversation !== undefined &&
      prevProps.conversation !== undefined &&
      !_.isEqual(prevProps.conversation, this.props.conversation)
    ) {
      let sheetLink = "";
      let sheetsVariable = "";
      if (this.props.conversation.settings["google_sheets"] !== undefined) {
        sheetLink = this.props.conversation.settings["google_sheets"];
        if (
          this.props.conversation.settings["google_sheets_inbound"] !==
          undefined
        ) {
          sheetsVariable =
            this.props.conversation.settings["google_sheets_inbound"];
        }
      }
      this.setState({
        conversationName: this.props.conversation.name,
        conversationLanguage: this.props.conversation.language,
        googleSheetLink: sheetLink,
        googleSheetVariable: sheetsVariable,
        timezone: this.props.conversation.settings.timezone ?? null,
        autoSave: "sync",
        completeLoader: null,
      });
    }
  }

  onUnload = (e) => {
    if (!this.props.conversation?.id && this.state.showReloadPrompt) {
      e.returnValue = "";
    }
    return true;
  };

  onBackHistory = (e) => {
    this.props.selectNode(null);
  };

  componentDidMount() {
    // Before Unload Confirmation Prompt
    window.addEventListener("beforeunload", this.onUnload);
    window.addEventListener("popstate", this.onBackHistory);

    this.diagramEngine.setForceUpdate(() => {
      this.forceUpdate();
    });

    this.props.fetchHSMList();

    const pageName = "create conversation";
    events.page(pageName);
  }

  componentWillUnmount() {
    // Before Unload Confirmation Prompt
    window.removeEventListener("beforeunload", this.onUnload);
  }

  initializeDiagramEngine() {
    let diagramModel = this.diagramEngine.getDiagramModel();

    // register widget factories

    // node factories
    //this.diagramEngine.registerNodeFactory(new QuestionWidgetFactory());
    this.diagramEngine.registerNodeFactory(new QuestionOpenWidgetFactory());
    this.diagramEngine.registerNodeFactory(new QuestionClosedWidgetFactory());
    this.diagramEngine.registerNodeFactory(
      new QuestionClosedButtonsWidgetFactory()
    );
    this.diagramEngine.registerNodeFactory(
      new QuestionClosedListWidgetFactory()
    );
    this.diagramEngine.registerNodeFactory(new ConditionalNodeWidgetFactory());
    this.diagramEngine.registerNodeFactory(new ABNodeWidgetFactory());
    this.diagramEngine.registerNodeFactory(new AgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new HubSpotAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new ZendeskAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new FreshdeskAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new KustomerAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new CustomAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new IntercomAgentWidgetFactory());
    this.diagramEngine.registerNodeFactory(new HSMWidgetFactory());
    this.diagramEngine.registerNodeFactory(new PollRedirectionWidgetFactory());
    this.diagramEngine.registerNodeFactory(
      new HelpdeskActionNodeWidgetFactory()
    );
    this.diagramEngine.registerNodeFactory(
      new HelpdeskTicketNodeWidgetFactory()
    );
    // link factories
    this.diagramEngine.registerLinkFactory(new DefaultLinkFactory());

    // register instance factories

    // node factories
    this.diagramEngine.registerInstanceFactory(new QuestionNodeFactory());
    this.diagramEngine.registerInstanceFactory(new QuestionOpenNodeFactory());
    this.diagramEngine.registerInstanceFactory(new QuestionClosedNodeFactory());
    this.diagramEngine.registerInstanceFactory(
      new QuestionClosedButtonsNodeFactory()
    );
    this.diagramEngine.registerInstanceFactory(
      new QuestionClosedListNodeFactory()
    );
    this.diagramEngine.registerInstanceFactory(new ConditionalNodeFactory());
    this.diagramEngine.registerInstanceFactory(new ABNodeFactory());
    this.diagramEngine.registerInstanceFactory(new AgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new HubSpotAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new ZendeskAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new FreshdeskAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new KustomerAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new CustomAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new IntercomAgentNodeFactory());
    this.diagramEngine.registerInstanceFactory(new HSMNodeFactory());
    this.diagramEngine.registerInstanceFactory(
      new PollRedirectionNodeFactory()
    );
    this.diagramEngine.registerInstanceFactory(new HelpdeskActionNodeFactory());
    this.diagramEngine.registerInstanceFactory(new HelpdeskTicketNodeFactory());
    // port factories
    this.diagramEngine.registerInstanceFactory(new AnswerPortFactory());
    this.diagramEngine.registerInstanceFactory(new ProbabilityPortFactory());
    this.diagramEngine.registerInstanceFactory(
      new DefaultPortInstanceFactory()
    );
    // link factory
    this.diagramEngine.registerInstanceFactory(new LinkInstanceFactory());
  }

  fixOldSerialization = (serializeDiagram) => {
    if (!("nodes" in serializeDiagram)) return;

    serializeDiagram.offsetX = 0;
    serializeDiagram.offsetY = 0;

    if (serializeDiagram.zoom < 10) serializeDiagram.zoom = 10;

    serializeDiagram["nodes"] = serializeDiagram["nodes"].map((oldNode) => {
      if (oldNode._class !== "QuestionNodeModel") return oldNode;

      let isOpenQuestion = true;

      let _class = "";
      let type = "";
      let webhookRead = null;
      let webhookDelivered = null;
      let text = "";
      let getSaveOnVariable = null;
      let timeout = null;

      oldNode["ports"] = oldNode["ports"].map((oldPort) => {
        let answerType = "";
        let _class = "";
        let timeout = null;

        if (oldPort["in"] == true) return oldPort;

        if (oldPort["name"] == "open") {
          answerType = ANSWER_PORT_TYPE_OPEN;
          _class = "AnswerPortModel";
        } else if (oldPort["name"] == "not-answer-timeout") {
          answerType = ANSWER_PORT_TYPE_TIMEOUT;
          _class = "AnswerPortModel";
          timeout = oldPort["label"];
        } else {
          isOpenQuestion = false;
          answerType = ANSWER_PORT_TYPE_CLOSED;
          _class = "AnswerPortModel";
        }

        return {
          ...oldPort,
          _class,
          answerType,
          timeout,
        };
      });

      // there is a bug, some closed questions have open answers, fixing it
      if (isOpenQuestion) {
        _class = "QuestionOpenNodeModel";
        type = "default-question-open";
      } else {
        _class = "QuestionClosedNodeModel";
        type = "default-question-closed";
      }

      webhookRead = oldNode["webhook_read"];
      webhookDelivered = oldNode["webhook_delivered"];
      text = oldNode["name"];
      getSaveOnVariable = oldNode["attr"];

      return {
        ...oldNode,
        _class,
        webhookRead,
        webhookDelivered,
        text,
        getSaveOnVariable,
        type,
      };
    });

    serializeDiagram;

    return serializeDiagram;
  };

  /**
   * Add a node to the model
   * @param  {DefaultNodeModel} NodeClass The class of the node to be added (QuestionNodeModel, AgentNodeModel, ...)
   * @param  {object}           param     The parameter to be passed to the class constructor (ex: 'Question text' for QuestionNodeModel)
   * @return {null}
   *
   * TODO
   * extend "param" so it can receive multiple parametes and desconstruct it at the Node creation
   */
  addNode = (NodeClass, ...params) => {
    this.forceUpdate();

    let diagramModel = this.diagramEngine.getDiagramModel();

    let nodeModel = new NodeClass(...params);
    nodeModel.x = -(diagramModel.offsetX - 500);
    nodeModel.y = -(diagramModel.offsetY - 200);

    diagramModel.addNode(nodeModel);

    this.diagramEngine.forceUpdate();
    return nodeModel;
  };

  addTwilioListNode = (NodeClass, ...params) => {
    const twilioContentSid = prompt(
      language.askTwilioListContentSid,
      "HXXXXXXXXXXXXXXXXXXX"
    );
    if (!twilioContentSid) return;

    this.props.fetchTwilioMessageContent(twilioContentSid, (data) => {
      const listMessage = data.types["twilio/list-picker"];
      this.forceUpdate();

      let diagramModel = this.diagramEngine.getDiagramModel();

      let nodeModel = new NodeClass(...params);
      nodeModel.x = -(diagramModel.offsetX - 500);
      nodeModel.y = -(diagramModel.offsetY - 200);
      nodeModel.setText(`[NODE_CONTENT_SID=${data.sid}]\n${listMessage.body}`);

      listMessage.items.map((item) => {
        const portModel = new AnswerPortModel(
          item.id,
          ANSWER_PORT_TYPE_CLOSED_CONTROLLED,
          "",
          200
        );
        nodeModel.addPort(portModel);
      });
      nodeModel.removePort(nodeModel.getOrderedClosedPorts()[0]);

      diagramModel.addNode(nodeModel);
      this.diagramEngine.forceUpdate();
    });
  };

  onChange = (serializedModel, action) => {
    const actionType = action.type;
    const { items } = action;
    if (actionType !== "diagram-scroll") {
      console.log({ actionType });
      console.log({ items });
      console.log("action", action);
      this.forceUpdate();
    }

    if (
      (action.type === "double-click" || action.type === "open-side-bar") &&
      items.length
    ) {
      console.log({ actionType });
      console.log({ items });
      const model = items[0];
      if (model instanceof ABNodeModel) {
        return;
      }

      if (
        !(
          model instanceof QuestionNodeModel ||
          model instanceof HubSpotAgentNodeModel ||
          model instanceof AgentNodeModel ||
          model instanceof FreshdeskAgentNodeModel ||
          model instanceof ZendeskAgentNodeModel ||
          model instanceof KustomerAgentNodeModel ||
          model instanceof CustomAgentNodeModel ||
          model instanceof IntercomAgentNodeModel ||
          model instanceof PollRedirectionNodeModel ||
          model instanceof HelpdeskActionNodeModel ||
          model instanceof HelpdeskTicketNodeModel
        )
      )
        return;

      model.editing = true;

      this.setState({ modifyingLinkWebhook: false, webhookText: "" });
      this.props.selectNode(model);
    } else if (action.type == "link-selected") {
      this.props.selectNode(null);
      if (!action.model) return;
      const actionSourceModel = action.model.sourcePort.parentNode;
      if (
        actionSourceModel instanceof HelpdeskActionNodeModel ||
        actionSourceModel instanceof HelpdeskTicketNodeModel
      ) {
        return;
      }

      this.setState({
        webhookText:
          action.model.sourcePort.getWebhook() != undefined
            ? action.model.sourcePort.getWebhook()
            : "",
        selectedLink: action.model,
        modifyingLinkWebhook: true,
      });
    } else {
      this.setState({
        selectedLink: null,
        modifyingLinkWebhook: false,
        webhookText: "",
      });
    }
    if (action.type == "canvas-shift-select") {
      this.props.selectNode(null);
      this.setState({ openConversationConfiguration: false });
    }
    //this step was taken ir order to fulfills design expectations regarding tooltips
    //we recomend NEVER doing this.
    if (action.type === "diagram-scroll") {
      let componentsToDeleteImage = document.getElementsByClassName(
        "alternative-flux-tootltip"
      );
      let componentsToDeleteSimple =
        document.getElementsByClassName("simple-tooltip");

      if (componentsToDeleteImage.length !== 0) {
        Array.prototype.forEach.call(
          componentsToDeleteImage,
          function (component) {
            return (component.style.visibility = "hidden");
          }
        );
      }
      if (componentsToDeleteSimple.length !== 0) {
        Array.prototype.forEach.call(
          componentsToDeleteSimple,
          function (component) {
            return (component.style.visibility = "hidden");
          }
        );
      }
    }

    if (action.type === "diagram-zoom") {
      console.log("New zoom", action.zoom);
    }
  };

  preventCreation = () => {
    let pollCategory = this.props.conversation?.category;
    if (!pollCategory) {
      let foundLabelKey = Object.keys(this.props.labels).find(
        (labelId) => labelId === this.state.labelId?.toString()
      );
      if (foundLabelKey) {
        pollCategory = this.props.labels[foundLabelKey];
      }
    }
    if (!pollCategory) {
      return false;
    }

    const diagramModel = this.diagramEngine.getDiagramModel();
    const nodes = diagramModel.getNodes();
    const nodesCount = Object.values(nodes).length;
    if (
      nodesCount <= 100 &&
      me.id &&
      FORCE_GOAL_COMPANIES.includes(me.id) &&
      !this.props.recommendations.GOAL_BLOCK &&
      FORCE_GOAL_LABELS.includes(pollCategory)
    ) {
      this.setState({
        saveModal: false,
        goalBlockModal: true,
      });
      return true;
    }
    return false;
  };

  renderGoalBlockModal = () => {
    return (
      <CustomModal
        show={this.state.goalBlockModal}
        title={""}
        body={
          <div className="goal-block-body">
            <div className="flex-container">
              <button onClick={() => this.setState({ goalBlockModal: false })}>
                <div className="icon icon--close" />
              </button>
            </div>
            <div className="goal-block-body-container">
              <div className="goal-block-description">
                <span>
                  <p className="emoji">⚠️</p>
                  <h6>{language["GOAL_BLOCKtitle"]}</h6>
                </span>
                <p>{language["GOAL_BLOCKmustHave"]}</p>
                <button
                  className="blue"
                  onClick={() => this.setState({ goalBlockModal: false })}
                >
                  {language.understood}
                </button>
              </div>
              <div className="goal-block-image" />
            </div>
          </div>
        }
        buttons={[]}
        class={"goal-block-modal"}
      />
    );
  };

  saveConversation = (saveAsCopy) => {
    const prevent = this.preventCreation();
    if (prevent) {
      return;
    }
    try {
      const diagramModel = this.diagramEngine.getDiagramModel();
      const apiSchema = this.getAPISchema();
      let conversationName = this.state.conversationName;
      let settings = {};
      let googleSheet = this.state.googleSheetLink;
      if (googleSheet != "") {
        settings["google_sheets"] = googleSheet;
        if (this.state.googleSheetVariable != "") {
          settings["google_sheets_inbound"] = this.state.googleSheetVariable;
        }
      }
      if (this.state.timezone) {
        settings["timezone"] = this.state.timezone;
      }

      if (!apiSchema) {
        return;
      }

      this.setState({
        showReloadPrompt: false,
        completeLoader: "loadingConversation",
        saveModal: false,
      });

      events.track("Save conversation score", {
        Depth: this.props.recommendationSummary.level,
        Score: this.props.recommendationSummary.score,
        "Using Buttons block": this.props.recommendations.BUTTONS_BLOCK,
        "Using goal block": this.props.recommendations.GOAL_BLOCK,
        "Minimum two blocks": this.props.recommendations.TWO_BLOCK_MINIMUM,
        "Using emojis": this.props.recommendations.EMOJIS,
        "Using default answer": this.props.recommendations.NOT_INCLUDED_ANSWER,
        "Short texts": this.props.recommendations.SHORT_TEXT,
      });

      this.props.saveConversation(
        this.props.conversation.id,
        saveAsCopy,
        apiSchema,
        diagramModel.serializeDiagram(),
        conversationName,
        this.state.conversationLanguage,
        settings
      );
    } catch (error) {
      this.setState({ showReloadPrompt: true, completeLoader: null });
      alert(`${language.errorSavingConversation} ${error}`);
    }
  };

  addNewCustomModal = () => {
    const typeToModel = {
      BUTTONS_BLOCK: QuestionClosedButtonsNodeModel,
      TWO_BLOCK_MINIMUM: QuestionOpenNodeModel,
      EMOJIS: QuestionOpenNodeModel,
    };
    let diagramModel = this.diagramEngine.getDiagramModel();

    let nodeModel = new typeToModel[this.state.modal.type]();
    nodeModel.x = -(diagramModel.offsetX - 500);
    nodeModel.y = -(diagramModel.offsetY - 200);
    if (this.state.modal.type == "EMOJIS")
      nodeModel.setText(language.questionEmojis);

    diagramModel.addNode(nodeModel);
    this.diagramEngine.forceUpdate();
  };

  automaticImprovement = (hsmGoal, buttonQuestion, emojiQuestion) => {
    let diagramModel = this.diagramEngine.getDiagramModel();
    // HSM Goal
    if (hsmGoal) {
      let nodes = diagramModel.getNodes();
      Object.keys(nodes).forEach((nodeId) => {
        const node = nodes[nodeId];
        if (node instanceof HSMNodeModel) {
          const currentGoal = node.getGoalMeasurement().targetEvents.length > 0;
          if (!currentGoal) {
            node.updateGoalMeasurement({
              campaignGoal: constants.GOAL_OTHER,
              targetEvents: [{ type: constants.TARGET_EVENT_READ }],
            });
            node.setSelected(true);
          }
        }
      });
    }

    // Button Question
    if (buttonQuestion) {
      let buttonNodeModel = new QuestionClosedButtonsNodeModel();
      buttonNodeModel.newClosedPortAfterPort(
        buttonNodeModel.getOrderedClosedPorts()[0]
      );
      buttonNodeModel.x = -(diagramModel.offsetX - 200);
      buttonNodeModel.y = -(diagramModel.offsetY - 200);
      buttonNodeModel.setSelected(true);

      diagramModel.addNode(buttonNodeModel);
    }

    // Emojis
    if (emojiQuestion) {
      let emojiNodeModel = new QuestionOpenNodeModel();
      emojiNodeModel.x = -(diagramModel.offsetX - 600);
      emojiNodeModel.y = -(diagramModel.offsetY - 200);
      emojiNodeModel.setText(language.questionEmojis);
      emojiNodeModel.setSelected(true);
      diagramModel.addNode(emojiNodeModel);
    }

    this.diagramEngine.forceUpdate();
  };

  createConversation = () => {
    if (this.state.createBtnDisabled) {
      return;
    }
    try {
      const diagramModel = this.diagramEngine.getDiagramModel();
      const apiSchema = this.getAPISchema();

      if (!apiSchema) return;
      events.track("Save conversation score", {
        Depth: this.props.recommendationSummary.level,
        Score: this.props.recommendationSummary.score,
        "Using Buttons block": this.props.recommendations.BUTTONS_BLOCK,
        "Using goal block": this.props.recommendations.GOAL_BLOCK,
        "Minimum two blocks": this.props.recommendations.TWO_BLOCK_MINIMUM,
        "Using emojis": this.props.recommendations.EMOJIS,
        "Using default answer": this.props.recommendations.NOT_INCLUDED_ANSWER,
        "Short texts": this.props.recommendations.SHORT_TEXT,
      });
      this.props.createConversation(
        "TEST",
        this.state.conversationLanguage,
        apiSchema,
        "whatsapp",
        diagramModel.serializeDiagram(),
        "customer_feedback",
        0,
        {},
        ""
      );
    } catch (error) {
      alert(`${language.errorCreatingConversation} ${error}`);
    }
  };

  getAPISchema = () => {
    const diagramModel = this.diagramEngine.getDiagramModel();

    let links = diagramModel.getLinks();
    let nodes = diagramModel.getNodes();

    let nodeidsToInts = _.invert(Object.keys(nodes));
    let IntsToNodeIds = Object.keys(nodes);

    // root node has no connections at input ports
    let possibleRootNodes = Object.values(nodes).filter(
      (node) =>
        !node.getInPort() || Object.values(node.getInPort().links).length === 0
    );
    if (possibleRootNodes.length != 1) {
      possibleRootNodes.forEach((node) => {
        node.setError(true);
      });
      this.forceUpdate();
      Toaster({
        title: language.noStart,
        type: "error",
        closeButton: true,
      });
      return null;
    }

    const rootNode = possibleRootNodes[0];

    let nodeIDToAPIID = (nodeId) => nodeidsToInts[nodeId];
    let APIIDTONodeID = (APIID) => IntsToNodeIds[APIID];

    const getAlternateFlowNode = (node) => {
      let apiSchema = node.getAPISchema(nodeIDToAPIID);
      if (!apiSchema) {
        return null;
      }
      let timeout = apiSchema.question_not_answer_timeout;
      if (timeout === undefined) {
        return null;
      }
      let timeoutNodeId = APIIDTONodeID(timeout.to_question_id);
      let timeoutNode = Object.values(nodes).filter(
        (node) => node.id === timeoutNodeId
      );
      if (timeoutNode.length === 0) {
        return null;
      }
      timeoutNode = timeoutNode[0];

      return timeoutNode;
    };

    let questions = [rootNode.getAPISchema(nodeIDToAPIID)];

    let invalidNodes = [];
    let validAlternateFlows = true;
    Object.values(nodes).forEach((node) => {
      let nodeApiSchema = node.getAPISchema(nodeIDToAPIID);
      if (!nodeApiSchema) {
        invalidNodes.push(node);
        return;
      }

      if (node === rootNode) {
        return;
      }

      questions.push(nodeApiSchema);

      let chainedAlternateFlowNodes = [node];
      let nextAlternateFlowNode = getAlternateFlowNode(node);
      while (nextAlternateFlowNode && validAlternateFlows) {
        chainedAlternateFlowNodes.push(nextAlternateFlowNode);
        let alternateFlowNode = getAlternateFlowNode(nextAlternateFlowNode);
        if (chainedAlternateFlowNodes.includes(alternateFlowNode)) {
          validAlternateFlows = false;
        }
        nextAlternateFlowNode = alternateFlowNode;
      }
    });

    // ! Prevent save with HubSpot V1
    const hubspotV1Nodes = Object.values(nodes).filter(
      (node) => node instanceof HubSpotAgentNodeModel && node.version === "V1"
    );
    if (hubspotV1Nodes.length > 0) {
      hubspotV1Nodes.forEach((n) => n.setError(true));
      this.forceUpdate();
      Toaster({
        title: language.hubspotV1Error,
        type: "error",
        closeButton: true,
      });
      return null;
    }

    if (invalidNodes.length > 0) {
      invalidNodes.forEach((n) => n.setError(true));
      this.forceUpdate();
      Toaster({
        title: language.nodeErrors,
        type: "error",
        closeButton: true,
      });
      return null;
    }

    if (!validAlternateFlows) {
      Toaster({
        title: language.alternateFlowError,
        type: "error",
        closeButton: true,
      });
      return null;
    }

    let validPollRedirections = true;
    let questiosnWithRedirections = questions.filter(
      (question) => question.question_type == "POLL_REDIRECTION"
    );
    let availablePolls = this.props.polls.map((poll) => poll.id);
    questiosnWithRedirections.forEach((question) => {
      let poll_id = question.text.replace(/[\[\]']+/g, "");
      if (!availablePolls.includes(parseInt(poll_id))) {
        validPollRedirections = false;
      }
    });
    if (!validPollRedirections) {
      Toaster({
        title: language.noPollRed,
        type: "error",
        closeButton: true,
      });
      return null;
    }

    return questions;
  };

  getWebhookFromConversation = () => {
    const apiSchema = this.getAPISchema();
    if (!apiSchema) {
      return;
    }
    let webhooks = [];
    for (let i = 0; i < apiSchema.length; i++) {
      let question = apiSchema[i];
      let answers = question["answers"];
      for (let j = 0; j < answers.length; j++) {
        let answer = question["answers"][j];
        let webhook = answer["webhook"];
        if (webhook !== "") {
          webhooks.push(webhook);
        }
      }
    }
    if (this.state.googleSheetLink != "") {
      webhooks.push(this.state.googleSheetLink);
    }
    return webhooks;
  };

  checkIfWebhookIsGoogleSheet = (webhooks) => {
    let google_sheets = webhooks.filter((url) =>
      url.includes(GOOGLE_SHEETS_URL)
    );
    return google_sheets;
  };

  renderSheetsModal = () => {
    const resetState = () => {
      this.setState({ sheetsModal: false, sheetsModalMessage: "" });
    };
    if (!this.state.sheetsModal) return;
    return (
      <Modal
        show={this.state.sheetsModal}
        onClose={resetState}
        title={language.atention}
        body={
          <div>
            <div>
              <p>{this.state.sheetsModalMessage}</p>
            </div>
          </div>
        }
        buttons={[
          {
            onClick: resetState,
            body: language.cancel,
          },
        ]}
      />
    );
  };

  downloadScreenshot = () => {
    const domNode = document.getElementById("create-conversation-wrapper");
    const scale = 4;
    domtoimage
      .toPng(domNode, {
        width: domNode.clientWidth * scale,
        height: domNode.clientHeight * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
        },
      })
      .then((dataUrl) => {
        var link = document.createElement("a");
        link.download = `${this.state.conversationName}.png`;
        link.href = dataUrl;
        link.click();
      });
  };

  getModelVariables = () => {
    const variableRegex = /{{\w+}}/g;

    const diagramModel = this.diagramEngine.getDiagramModel();

    const nodes = diagramModel.getNodes();

    let variables = [];
    Object.values(nodes).forEach((node) => {
      if (node instanceof QuestionNodeModel) {
        variables = variables.concat(node.getVariables());
      }
    });

    return variables;
  };

  editConversationSettings = (attribute, value) => {
    const mapAttributeToKey = {
      name: "conversationName",
      language: "conversationLanguage",
      googleSheet: "googleSheetLink",
      googleSheetVariable: "googleSheetVariable",
      integration: "integrationType",
      timezone: "timezone",
    };
    let newState = {};
    newState[mapAttributeToKey[attribute]] = value;
    this.setState(newState);
  };

  closeConfigurationPanel = () => {
    this.setState({ openConversationConfiguration: false });
    this.props.selectNode(null);
  };

  renderConfigurationPanel = () => {
    return (
      <ConfigurationPanel
        {...this.props}
        conversation={{
          name: this.state.conversationName,
          language: this.state.conversationLanguage,
          timezone: this.state.timezone,
          open: this.state.openConversationConfiguration,
          callback: this.editConversationSettings,
          integrationType: this.state.integrationType,
          googleSheetLink: this.state.googleSheetLink,
          googleSheetVariable: this.state.googleSheetVariable,
        }}
        modelVariables={this.getModelVariables()}
        forceUpdate={() => {
          this.forceUpdate();
          this.diagramEngine.forceUpdate();
        }}
        diagramEngine={this.diagramEngine}
        closePanel={() => this.closeConfigurationPanel()}
        trackEvent={trackEvent}
      />
    );
  };

  renderDropdownNodeItem = (model) => {
    const header = {
      ["IntegrationsSuperTitle"]: language.integrations,
      ["SendEmailModel"]: language.sendEmail,
      ["ZohoModel"]: "Zoho",
      ["SalesforceModel"]: "Salesforce",
      ["PipedriveModel"]: "Pipedrive",
      ["ZapierModel"]: "Zapier",
      ["CustomModel"]: language.custom,
      ["GoogleSheets"]: "Google Sheets",
    };

    const description = {
      ["SendEmailModel"]: language.sendEmailD,
      ["ZohoModel"]: language.createAndUpdate.replace(/{{CRM}}/g, "Zoho"),
      ["SalesforceModel"]: language.createAndUpdate.replace(
        /{{CRM}}/g,
        "Salesforce"
      ),
      ["PipedriveModel"]: language.createAndUpdate.replace(
        /{{CRM}}/g,
        "Pipedrive"
      ),
      ["ZapierModel"]: language.connectTrebleWith.replace(
        /{{APPLICATION}}/g,
        "Zapier"
      ),
      ["CustomModel"]: language.customD,
      ["GoogleSheets"]: language.sheetsMsg,
    };

    const image = {
      ["SendEmailModel"]: iconSendEmailImage,
      ["ZohoModel"]: iconZohoImage,
      ["SalesforceModel"]: iconSalesforceImage,
      ["PipedriveModel"]: iconPipedriveImage,
      ["ZapierModel"]: iconZapierImage,
      ["CustomModel"]: iconCustomImage,
      ["GoogleSheets"]: sheetsImage,
    };

    const headerIcon = {
      ["SendEmailModel"]: "lock",
      ["ZohoModel"]: "lock",
      ["SalesforceModel"]: "lock",
      ["PipedriveModel"]: "lock",
      ["ZapierModel"]: "lock",
      ["CustomModel"]: "lock",
    };

    const renderHeaderIcon = (model) => {
      if (headerIcon[model]) {
        if (typeof headerIcon[model] === "string") {
          return <div className={`icon icon--${headerIcon[model]}`}></div>;
        } else {
          return headerIcon[model];
        }
      } else {
        return;
      }
    };

    const handleClick = () => {
      if (typeof headerIcon[model] === "string") {
        events.track("Click on locked integration", {
          integration_name: header[model],
        });
      }
    };

    let dropdownItem = (
      <div className="card">
        <div className="card-content" onClick={handleClick}>
          <div className="media">
            <div className="media-left">
              <figure className="image is-40x40">
                <img src={image[model]} />
              </figure>
            </div>
            <div className="media-content">
              <div className="title-container">
                <p className="title is-4">{header[model]}</p>
                {renderHeaderIcon(model)}
              </div>
              <p className="subtitle is-6">{description[model]}</p>
            </div>
          </div>
        </div>
      </div>
    );

    return dropdownItem;
  };

  renderStateModal = (key, value) => {
    let dict = {};
    dict[key] = value;
    return dict;
  };

  renderHelpdeskModal = () => {
    const mapHelpdeskToNodeModel = {
      FRESHDESK: FreshdeskAgentNodeModel,
      ZENDESK: ZendeskAgentNodeModel,
      KUSTOMER: KustomerAgentNodeModel,
      HUBSPOT: HubSpotAgentNodeModel,
      CUSTOMINTEGRATION: CustomAgentNodeModel,
      INTERCOM: IntercomAgentNodeModel,
    };

    if (!this.state.helpdeskModal) return;
    let integrationType;
    let node = null;
    if (this.state.selectedHelpdesk) {
      integrationType = this.state.selectedHelpdesk;
      node = mapHelpdeskToNodeModel[integrationType];
    }
    const resetState = () => {
      this.setState({
        helpdeskModal: false,
        helpdeskAPIKey: "",
        helpdeskHost: "",
        helpdeskEmail: "",
        helpdeskCompanyId: "",
        helpdeskPhoneProperty: "",
        validateHelpdesk: false,
      });
    };
    const renderAlert = (validField, validated) => {
      if (!validField && validated) {
        return <InlineAlert type="error" title={language.completeField} />;
      } else {
        return;
      }
    };

    let lowIntegrationType = integrationType.toLowerCase();
    let integrationTypeDisplay =
      lowIntegrationType.charAt(0).toUpperCase() + lowIntegrationType.slice(1);

    let formObject;
    if (integrationType == "ZENDESK") {
      formObject = (
        <>
          <div className="modal-integration-text">
            <p>
              {"1. "}
              {language.helpdeskHost}
              <a
                target="_blank"
                href="https://treble-files.s3.amazonaws.com/zendesk+company+domain.png"
              >
                <div className="icon icon--help-circle" />
              </a>
            </p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`trebleai`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskHost: e.target.value });
                }}
                value={this.state.helpdeskHost}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskHost, this.state.validateHelpdesk)}
          <div className="modal-integration-text">
            <p>
              {"2. "}
              {language.helpdeskAdminAccess.replace(
                "{{HELPDESK}}",
                integrationTypeDisplay
              )}
            </p>
          </div>
          <div className="modal-integration-text">
            <p>
              {"3. "}
              {language.installHelpdeskApp.replace(
                "{{HELPDESK}}",
                integrationTypeDisplay
              )}
            </p>
            <p className="description">{language.installZendeskApiKeyHelp}</p>
            <a
              href="https://www.zendesk.com/apps/support/687882/whatsapp-by-treble/"
              target="_blank"
            >
              <button className="zendesk">
                <img src={iconZendeskImage} />
                <p>{language.installHere}</p>
              </button>
            </a>
          </div>
        </>
      );
    } else if (integrationType == "FRESHDESK") {
      formObject = (
        <>
          <div className="modal-integration-text">
            <p>{language.helpdeskAPIKey}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`e.g: qialzfTaXEQnqtthkwwax`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskAPIKey: e.target.value });
                }}
                value={this.state.helpdeskAPIKey}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskAPIKey, this.state.validateHelpdesk)}
          <div className="modal-integration-text">
            <p>{language.helpdeskHost}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`trebleai`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskHost: e.target.value });
                }}
                value={this.state.helpdeskHost}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskHost, this.state.validateHelpdesk)}
        </>
      );
    } else if (integrationType == "KUSTOMER" || integrationType == "INTERCOM") {
      formObject = (
        <>
          <div className="modal-integration-text">
            <p>{language.helpdeskAPIKey}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`e.g: qialzfTaXEQnqtthkwwax`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskAPIKey: e.target.value });
                }}
                value={this.state.helpdeskAPIKey}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskAPIKey, this.state.validateHelpdesk)}
        </>
      );
    } else if (integrationType == "CUSTOMINTEGRATION") {
      formObject = (
        <>
          <div className="modal-integration-text">
            <p>{language.helpdeskAPIKey}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`e.g: qialzfTaXEQnqtthkwwax`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskAPIKey: e.target.value });
                }}
                value={this.state.helpdeskAPIKey}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskAPIKey, this.state.validateHelpdesk)}
          <div className="modal-integration-text">
            <p>{language.helpdeskHost}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`trebleai`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskHost: e.target.value });
                }}
                value={this.state.helpdeskHost}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskHost, this.state.validateHelpdesk)}
        </>
      );
    } else if (integrationType == "HUBSPOT") {
      formObject = (
        <>
          <div style={{ margin: "8px 0px 16px 0px" }}>
            <hr />
            <div className="modal-integration-text">
              <p style={{ fontWeight: "600" }}>
                {"1. "}
                {language.installHelpdeskApp.replace(
                  "{{HELPDESK}}",
                  integrationTypeDisplay
                )}
              </p>
            </div>
            <div className="modal-integration-text">
              <p style={{ fontWeight: "600" }}>
                {"2. "}
                {language.helpdeskPhoneProperty.replace(
                  "{{HELPDESK}}",
                  integrationTypeDisplay
                )}
              </p>
              <Radio.Group
                onChange={(e) => {
                  this.setState({ helpdeskPhoneProperty: e.target.value });
                }}
                value={this.state.helpdeskPhoneProperty}
              >
                <Radio value={"phone"}>Phone</Radio>
                <Radio value={"mobilephone"}>Mobilephone</Radio>
              </Radio.Group>
              {renderAlert(
                this.state.helpdeskPhoneProperty,
                this.state.validateHelpdesk
              )}
            </div>
            <div className="modal-integration-text">
              <p style={{ fontWeight: "600" }}>
                {"3. "}
                {language.helpdeskCompanyId.replace(
                  "{{HELPDESK}}",
                  integrationTypeDisplay
                )}
                <a
                  target="_blank"
                  href="https://treble-files.s3.amazonaws.com/HubSpot+Company+ID.png"
                >
                  <div className="icon icon--help-circle" />
                </a>
              </p>
            </div>
            <div className="field">
              <div className="control">
                <TextInput
                  className="input"
                  placeholder={`e.g: 1234567`}
                  type="text"
                  onChange={(e) => {
                    this.setState({ helpdeskCompanyId: e.target.value });
                  }}
                  value={this.state.helpdeskCompanyId}
                />
              </div>
            </div>
            {renderAlert(
              this.state.helpdeskCompanyId,
              this.state.validateHelpdesk
            )}
          </div>
          <div className="modal-integration-text">
            <p>
              {"4. "}
              {language.helpdeskEmail.replace(
                "{{HELPDESK}}",
                integrationTypeDisplay
              )}
            </p>
            <p className="description">{language.hubspotEmailD}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={`e.g: treble@treble.ai`}
                type="text"
                onChange={(e) => {
                  this.setState({ helpdeskEmail: e.target.value });
                }}
                value={this.state.helpdeskEmail}
              />
            </div>
          </div>
          {renderAlert(this.state.helpdeskEmail, this.state.validateHelpdesk)}
        </>
      );
    }
    return (
      <Modal
        show={this.state.helpdeskModal}
        onClose={() => {
          events.track("Dismiss connect with human integration");
          resetState();
        }}
        title={language.helpdeskModalTitle.replace(
          "{{HELPDESK}}",
          integrationTypeDisplay
        )}
        body={
          <div id="modal-for-helpdesk-integrations">
            <div>
              <p>
                {language.helpdeskAccess.replace(
                  "{{HELPDESK}}",
                  integrationTypeDisplay
                )}
              </p>
            </div>
            {formObject}
          </div>
        }
        buttons={[
          {
            onClick: () => {
              events.track("Dismiss connect with human integration");
              resetState();
            },
            body: language.cancel,
          },
          {
            body: language.connect,
            color: "treble",
            onClick: () => {
              this.setState({ validateHelpdesk: true });
              if (integrationType == "ZENDESK" && this.state.helpdeskHost) {
                this.props.createZendeskIntegration(
                  this.state.helpdeskHost,
                  () => {
                    Toaster({
                      title: language.successHelpdeskConnect.replace(
                        "{{HELPDESK}}",
                        integrationTypeDisplay
                      ),
                      type: "success",
                      closeButton: true,
                    });
                    this.addNode(node);
                  }
                );
                Toaster({
                  title: language.waitingHelpdeskConnect.replace(
                    "{{HELPDESK}}",
                    integrationTypeDisplay
                  ),
                  type: "loading",
                  closeButton: true,
                });
                resetState();
              }
              if (
                integrationType == "HUBSPOT" &&
                this.state.helpdeskCompanyId &&
                this.state.helpdeskEmail &&
                this.state.helpdeskPhoneProperty
              ) {
                this.props.createHubSpotIntegration(
                  this.state.helpdeskCompanyId,
                  this.state.helpdeskEmail,
                  this.state.helpdeskPhoneProperty,
                  () => {
                    Toaster({
                      title: language.successHubSpotConnect,
                      type: "success",
                      closeButton: true,
                    });
                    if (this.props.agentTags.length > 0) {
                      this.props.agentTags.forEach((tag) => {
                        if (tag.name === "DEFAULT") {
                          this.addNode(node, tag.name);
                        }
                      });
                    }
                    this.setState({ hubspotExtensionModal: true });
                  }
                );
                Toaster({
                  title: language.waitingHubSpotConnect,
                  type: "loading",
                  closeButton: true,
                });
                resetState();
              }
              if (
                (integrationType == "KUSTOMER" ||
                  integrationType == "INTERCOM" ||
                  integrationType == "CUSTOMINTEGRATION" ||
                  (integrationType == "FRESHDESK" &&
                    this.state.helpdeskHost)) &&
                this.state.helpdeskAPIKey
              ) {
                this.props.createHelpdeskIntegration(
                  this.state.helpdeskHost,
                  this.state.helpdeskAPIKey,
                  integrationType,
                  (email) => {
                    Toaster({
                      title: language.successHelpdeskConnect.replace(
                        "{{HELPDESK}}",
                        integrationTypeDisplay
                      ),
                      type: "success",
                      closeButton: true,
                    });
                    if (integrationType == "FRESHDESK")
                      this.addNode(node, email);
                    else this.addNode(node);
                  }
                );
                Toaster({
                  title: language.waitingHelpdeskConnect.replace(
                    "{{HELPDESK}}",
                    integrationTypeDisplay
                  ),
                  type: "loading",
                  closeButton: true,
                });
                resetState();
              }
            },
          },
        ]}
      />
    );
  };
  /**
   * checkHelpdeskIntegration verifies if company has integration, if it does not, it renders
   * a modal so the integration can be connected, if it has an integration but not the selected
   * one it will display a toaster with a warning that that is not the integration they have
   * and then if everything is correct it will add the corresponding integration node
   * @param  agentModel{obj} the selected option
   * @param helpdeskType {string} the integration type on big upper case
   * @return {bool}
   */
  checkHelpdeskIntegration = (agentModel, helpdeskType) => {
    let foundCorrectIntegration = false;
    if (this.props.helpdeskIntegrations.length > 0) {
      this.props.helpdeskIntegrations.forEach((helpdesk) => {
        if (helpdesk.helpdesk_integration_type === helpdeskType) {
          if (
            helpdeskType == "KUSTOMER" ||
            helpdeskType == "INTERCOM" ||
            helpdeskType == "CUSTOMINTEGRATION" ||
            helpdeskType == "ZENDESK"
          ) {
            this.addNode(agentModel);
            foundCorrectIntegration = true;
          } else if (helpdeskType == "HUBSPOT") {
            if (
              (helpdesk.settings.hubspot_company_id &&
                helpdesk.settings.access_token &&
                helpdesk.settings.refresh_token &&
                this.props.agentTags.length > 0) ||
              (helpdesk.settings.api_key &&
                helpdesk.settings.teams &&
                helpdesk.settings.teams.length > 0)
            ) {
              foundCorrectIntegration = true;
              if (this.props.agentTags.length > 0) {
                this.props.agentTags.forEach((tag) => {
                  if (tag.name === "DEFAULT") {
                    this.addNode(agentModel, tag.name, "", "V2");
                  }
                });
              } else {
                helpdesk.settings.teams.forEach((team) => {
                  if (
                    team.team === "Default" &&
                    foundCorrectIntegration === false
                  ) {
                    foundCorrectIntegration = true;
                    this.addNode(agentModel, "", team.email, "V1");
                    return true;
                  }
                });
              }
            }
          } else {
            if (helpdesk.settings.teams.length > 0) {
              helpdesk.settings.teams.forEach((team) => {
                if (
                  team.team === "Default" &&
                  foundCorrectIntegration === false
                ) {
                  foundCorrectIntegration = true;
                  this.addNode(agentModel, team.email);
                  return true;
                }
              });
            }
          }
        }
      });
    }
    if (!foundCorrectIntegration) {
      this.setState({ helpdeskModal: true, selectedHelpdesk: helpdeskType });
    }
    return foundCorrectIntegration;
  };

  checkConversation = (fun, args) => {
    fun(args);
  };

  checkAndShowToasterIfLinkIsGoogleSheet = (url) => {
    if (url.includes(GOOGLE_SHEETS_URL)) {
      Toaster({
        title: language.sheetsInclude,
        type: "success",
        closeButton: true,
      });
    }
  };

  renderIntegrationsModal = (model) => {
    const renderAlert = (validField, validated) => {
      if (!validField && validated) {
        return <InlineAlert type="error" title={language.completeField} />;
      } else {
        return;
      }
    };

    const description = {
      ["ABTestingModel"]: (
        <p>
          {language.abTestingLargeD}
          <br />
          <br />✨{language.wantBlock}
        </p>
      ),
      ["SendEmailModel"]: (
        <p>
          {language.sendEmailLargeD}
          <br />
          <br />✨{language.includeIntegration}
        </p>
      ),
      ["ZohoModel"]: (
        <p>
          {language.crmLargeD.replace(/{{CRM}}/g, "Zoho")}
          <br />
          <br />✨{language.includeIntegration}
        </p>
      ),
      ["SalesforceModel"]: (
        <p>
          {language.crmLargeD.replace(/{{CRM}}/g, "Salesforce")}
          <br />
          <br />✨{language.includeIntegration}
        </p>
      ),
      ["PipedriveModel"]: (
        <p>
          {language.crmLargeD.replace(/{{CRM}}/g, "Pipedrive")}
          <br />
          <br />✨{language.includeIntegration}
        </p>
      ),
      ["ZapierModel"]: (
        <p>
          {language.autoWorkflowsLargeD.replace(/{{APPLICATION}}/g, "Zapier")}
          <br />
          <br />✨{language.includeIntegration}
        </p>
      ),
      ["CustomModel"]: (
        <div>
          <div style={{ margin: "8px 0px 16px 0px" }}>
            <p style={{ fontWeight: "600" }}>{language.whichApplication}</p>
          </div>
          <div className="field">
            <div className="control">
              <TextInput
                className="input"
                placeholder={language.applicationName}
                type="text"
                onChange={(e) => {
                  this.setState({ customIntegrationName: e.target.value });
                }}
                value={this.state.customIntegrationName}
              />
            </div>
          </div>
          {renderAlert(
            this.state.customIntegrationName,
            this.state.validatedCustomIntegrationFields
          )}
          <div style={{ margin: "24px 0px 16px 0px" }}>
            <p style={{ fontWeight: "600" }}>{language.useCase}</p>
          </div>
          <InputTextarea
            placeholder={language.requestNewIntegrationD}
            onChange={(e) => {
              this.setState({ customIntegrationDescription: e.target.value });
            }}
            value={this.state.customIntegrationDescription}
          />
          {renderAlert(
            this.state.customIntegrationDescription,
            this.state.validatedCustomIntegrationFields
          )}
        </div>
      ),
    };

    const title = {
      ["ABTestingModel"]: language.abTesting,
      ["SendEmailModel"]: language.sendEmail,
      ["ZohoModel"]: language.integrationWith.replace(
        /{{APPLICATION}}/g,
        "Zoho"
      ),
      ["SalesforceModel"]: language.integrationWith.replace(
        /{{APPLICATION}}/g,
        "Salesforce"
      ),
      ["PipedriveModel"]: language.integrationWith.replace(
        /{{APPLICATION}}/g,
        "Pipedrive"
      ),
      ["ZapierModel"]: language.integrationWith.replace(
        /{{APPLICATION}}/g,
        "Zapier"
      ),
      ["CustomModel"]: language.requestNewIntegration,
    };

    const activeButton = {
      ["ABTestingModel"]: language.wantIt,
      ["SendEmailModel"]: language.requestIntegration,
      ["ZohoModel"]: language.requestIntegration,
      ["SalesforceModel"]: language.requestIntegration,
      ["PipedriveModel"]: language.requestIntegration,
      ["ZapierModel"]: language.requestIntegration,
      ["CustomModel"]: language.requestIntegration,
    };

    const typeRequest = {
      ["ABTestingModel"]: "Node",
      ["SendEmailModel"]: "Integration",
      ["ZohoModel"]: "Integration",
      ["SalesforceModel"]: "Integration",
      ["PipedriveModel"]: "Integration",
      ["ZapierModel"]: "Integration",
      ["CustomModel"]: "Integration",
    };

    const resetState = () => {
      this.setState({
        modalShow: false,
        customIntegrationName: "",
        customIntegrationDescription: "",
        selectedModal: "",
        validatedCustomIntegrationFields: false,
      });
    };

    return (
      <Modal
        show={this.state.modalShow}
        onClose={resetState}
        title={title[model]}
        body={description[model]}
        size={model == "CustomModel" ? "default" : "large"}
        buttons={[
          {
            onClick: resetState,
            body: language.cancel,
          },
          {
            onClick: () => {
              if (this.state.selectedModal == "CustomModel") {
                this.setState({ validatedCustomIntegrationFields: true });
                if (
                  this.state.customIntegrationName &&
                  this.state.customIntegrationDescription
                ) {
                  trackEvent("Integration/Node Request", {
                    type: typeRequest[model],
                    name: title[model],
                    integrationName: this.state.customIntegrationName,
                    description: this.state.customIntegrationDescription,
                  });
                } else {
                  return;
                }
              } else {
                trackEvent("Integration/Node Request", {
                  type: typeRequest[model],
                  name: title[model],
                });
              }
              Toaster({
                title: language.successRequest,
                type: "success",
                closeButton: true,
              });
              resetState();
            },
            body: activeButton[model],
            color: "treble",
          },
        ]}
      />
    );
  };

  renderNodeMenu = () => {
    const basicNodes = [
      {
        key: "OpenQuestion",
        model: QuestionOpenNodeModel,
        title: language.openQuestion,
        image: iconQuestionOpenImage,
        description: language.openQuestionD,
        track: "open question",
      },
      {
        key: "ClosedQuestion",
        model: "ClosedQuestion",
        title: language.closedQuestion,
        image: iconQuestionClosedImage,
        description: language.closedQuestionD,
      },
      {
        key: "Hsm",
        model: HSMNodeModel,
        title: language.withHsm,
        image: iconHSMImage,
        description: language.withHsmD,
        track: "HSM",
      },
    ];

    const advancedNodes = [
      {
        key: "ConditionalNode",
        model: ConditionalNodeModel,
        title: language.conditionals,
        image: iconConditionalImage,
        description: language.conditionalsD,
        track: "condition node",
        header: <NewComponentPill label={language.new} color="teal" />,
      },
      {
        key: "ABNode",
        model: ABNodeModel,
        title: language.abTesting,
        image: iconABTestingImage,
        description: language.abTestingD,
        track: "AB testing node",
      },
    ];

    const closedQuestionNodes = [
      {
        key: "OriginalClosedQuestion",
        model: QuestionClosedNodeModel,
        title: language.closedQuestion,
        image: iconQuestionClosedImage,
        description: language.closedQuestionD,
        track: "closed question",
      },
      {
        key: "ButtonsClosedQuestion",
        model: QuestionClosedButtonsNodeModel,
        title: language.closedQuestionButtons,
        image: iconClosedButtons,
        description: language.closedQuestionButtonsD,
        track: "buttons question",
      },
      {
        key: "ListClosedQuestion",
        model: QuestionClosedListNodeModel,
        title: language.closedQuestionList,
        image: iconClosedList,
        description: language.closedQuestionListD,
        track: "options list question",
      },
    ];

    const renderHeaderIcon = (node) => {
      if (node.header !== undefined) {
        if (typeof node.header === "string") {
          return <div className={`icon icon--${node.header}`}></div>;
        } else {
          return node.header;
        }
      } else {
        return;
      }
    };

    const renderMenuOption = (node) => {
      return (
        <div className="card">
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-40x40">
                  <img src={node.image} />
                </figure>
              </div>
              <div className="media-content">
                <div className="title-container">
                  <p className="title is-4">{node.title}</p>
                  {renderHeaderIcon(node)}
                </div>
                <p className="subtitle is-6">{node.description}</p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderNode = (node) => {
      if (node.model === HSMNodeModel) {
        const filteredHsms = this.props.hsmList.filter((hsm) =>
          (hsm.name + hsm.content)
            .toLowerCase()
            .includes(this.state.searchbarHsm.toLowerCase())
        );
        const renderHsm = (hsm) => {
          const metaDoc =
            "developers.facebook.com/docs/whatsapp/message-templates/guidelines#template-pausing";
          if (hsm.status == "PAUSED") {
            return (
              <>
                <p className="paused">{language.hsmPausedText}</p>
                <a href={`https://${metaDoc}`} target="_blank">
                  {metaDoc}
                </a>
              </>
            );
          } else {
            return (
              <>
                <p>{hsm.header?.text ? hsm.header.text : hsm.header?.url}</p>
                <p>{hsm.content}</p>
                <p>{hsm.footer?.text ? hsm.footer.text : ""}</p>
                {hsm.buttons?.options.map((button) => {
                  return (
                    <p key={hsm.buttons?.options.indexOf(button)}>
                      {button.text}
                    </p>
                  );
                })}
              </>
            );
          }
        };
        const renderHsms = () => {
          if (filteredHsms.length > 0) {
            return filteredHsms.map((hsm) => (
              <Menu.Item key={hsm.id}>
                <Tooltip
                  overlayClassName={`hsm ${hsm.status}`}
                  placement="rightBottom"
                  title={renderHsm(hsm)}
                >
                  <div className={`hsm ${hsm.status}`}>
                    {hsm.status == "PAUSED" && (
                      <div className="paused-hsm">
                        <p>{language.hsmPaused}</p>
                      </div>
                    )}
                    <h1>{hsm.name}</h1>
                    <h2>{hsm.content}</h2>
                  </div>
                </Tooltip>
              </Menu.Item>
            ));
          } else {
            return (
              <div className="hsm-no-results">
                <div className="no-results-image" />
                <div className="no-result-title">{language.noResults}</div>
                <div className="subtitle">{language.noHsm}</div>
              </div>
            );
          }
        };
        const renderSearchbar = () => {
          return (
            <div className="searchbar">
              <p className="control has-icons-left has-icons-right">
                <TextInput
                  className="input"
                  type="text"
                  onChange={({ target: { value } }) => {
                    this.setState({ searchbarHsm: value });
                  }}
                  value={this.state.searchbarHsm}
                  trackMessage="Search HSM to add"
                  placeholder={language.hsmPH}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
          );
        };

        return (
          <SubMenu key={node.key} title={renderMenuOption(node)}>
            {renderSearchbar()}
            {renderHsms()}
          </SubMenu>
        );
      } else if (node.model === "ClosedQuestion") {
        return (
          <SubMenu key={node.key} title={renderMenuOption(node)}>
            <p className="top-title">{language.closedQuestionList}</p>
            {closedQuestionNodes.map((subnode) => {
              if (
                !["SANUKER", "FACEBOOK", "CLOUD"].includes(
                  me["whatsapp_provider"]
                ) &&
                (subnode.key === "ButtonsClosedQuestion" ||
                  subnode.key === "ListClosedQuestion")
              ) {
                return;
              } else {
                return (
                  <Menu.Item key={subnode.key}>
                    {renderMenuOption(subnode)}
                  </Menu.Item>
                );
              }
            })}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={node.key}>{renderMenuOption(node)}</Menu.Item>;
      }
    };

    return (
      <Menu
        onOpenChange={(keys) => {
          if (keys.length == 1 && keys[0] == "Hsm") {
            this.setState({ searchbarHsm: "" });
          }
        }}
        onClick={(e) => {
          const keyPath = e.keyPath;
          const firstLevelKey = keyPath[keyPath.length - 1];
          const nodeOptions = basicNodes.concat(advancedNodes);
          const filteredNodeOptions = nodeOptions.filter(
            (node) => node.key === firstLevelKey
          );
          const nodeOption = filteredNodeOptions[0];
          if (
            [
              "OpenQuestion",
              "ConditionalNode",
              "PollRedirectionNode",
              "ABNode",
            ].includes(firstLevelKey)
          ) {
            const node = this.addNode(nodeOption.model, "");
            events.track(`Add ${nodeOption.track}`);
            if (nodeOption.model == PollRedirectionNodeModel) {
              this.setState({
                openConversationConfiguration: true,
              });
              this.props.selectNode(node);
            }
          } else if (firstLevelKey === "Hsm") {
            const secondLevelKey = keyPath[keyPath.length - 2];
            const filteredHsms = this.props.hsmList.filter(
              (hsm) => hsm.id.toString() === secondLevelKey
            );
            const hsm = filteredHsms[0];
            if (hsm.status == "PAUSED") return;
            this.addNode(nodeOption.model, hsm);
            events.track(`Add ${nodeOption.track}`, { hsm_id: hsm.id });
          } else if (firstLevelKey === "ClosedQuestion") {
            const secondLevelKey = keyPath[keyPath.length - 2];
            const filteredClosedQuestionNodes = closedQuestionNodes.filter(
              (node) => node.key === secondLevelKey
            );
            const nodeOption = filteredClosedQuestionNodes[0];
            this.addNode(nodeOption.model, "");
            events.track(`Add ${nodeOption.track}`);
          }
        }}
        mode="vertical"
      >
        <div className="nodes-title">{language.blockType}</div>
        <Menu.ItemGroup title={language.basicBlocks}>
          {basicNodes.map((node) => renderNode(node))}
        </Menu.ItemGroup>
        <Menu.ItemGroup title={language.advancedBlocks}>
          {advancedNodes.map((node) => renderNode(node))}
        </Menu.ItemGroup>
      </Menu>
    );
  };

  renderNodeDropdownV2 = () => {
    return (
      <Dropdown
        overlay={this.renderNodeMenu()}
        trigger={["click"]}
        destroyPopupOnHide={true}
      >
        <button className="navbar-item btn btn--grey-20 sm">
          <i className="icon icon--edit"></i>
        </button>
      </Dropdown>
    );
  };

  renderHeader = () => {
    if (this.props.visualization == "draft") {
      let diagramEngine = this.diagramEngine;
      let diagramModel = diagramEngine.getDiagramModel();
      const renderCreateConversationBtn = () => {
        let onClick = () => {};
        let btnText = null;
        if (this.state.editing) {
          onClick = () => {
            this.setState({ saveModal: true });
          };
          btnText = language.publish;
        } else {
          onClick = () => this.checkConversation(this.createConversation);
          btnText = language.publish;
        }

        return (
          <>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button className={`navbar-item btn`} onClick={onClick}>
                    {btnText}
                  </button>
                </div>
              </div>
            </div>
            <CustomModal
              show={this.state.saveModal}
              title={language.publishNewConvTitle}
              body={
                <div className="publish-conv-body">
                  <p>{language.publishConvSub}</p>
                  <div className="list-container">
                    <ul class="publish-warnings">
                      {[1, 2].map((item) => {
                        return <li>{language["publishItem" + item]}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              }
              buttons={
                <button
                  className="dark-purple"
                  onClick={() => {
                    this.checkConversation(this.saveConversation);
                  }}
                >
                  {language.publish}
                </button>
              }
              class={"publish-modal overwrite"}
              onClose={() => {
                this.setState({ saveModal: false });
              }}
            />
          </>
        );
      };

      return (
        <nav
          className="navbar has-background-black  "
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">{this.renderNodeDropdownV2()}</div>
          <div className="navbar-menu">
            <div className="navbar-start"></div>
            {renderCreateConversationBtn()}
          </div>

          {this.renderIntegrationsModal(this.state.selectedModal)}
          {this.renderSheetsModal()}
          {this.renderHelpdeskModal()}
        </nav>
      );
    } else {
      return (
        <div className="navbar-published-conversation">
          <div className="conversation-data">
            <p className="version">{language.currentPublishedConv}</p>
            {this.getLastUpdatedDate()}
          </div>
          <div className="middle-text">
            <OverlayTrigger
              placement={"bottom"}
              overlay={
                <BootstrapTooltip className="simple-tooltip publish-title">
                  <p>{language.noChangesApply}</p>
                </BootstrapTooltip>
              }
            >
              <p>{language.noChangesApply}</p>
            </OverlayTrigger>
          </div>
          <button
            onClick={() => {
              this.setState({ completeLoader: "changeVisualization" });
              this.props.changePollVisualization(
                "draft",
                this.diagramEngine,
                this.fixOldSerialization,
                this.props.conversation,
                this.onChange,
                () => {
                  this.setState({ completeLoader: null });
                }
              );
            }}
          >
            <p>{language.continueEditing}</p>
            <div className="icon icon--close" />
          </button>
        </div>
      );
    }
  };

  getLastUpdatedDate = () => {
    const dateObject = moment
      .utc(this.props.conversation.last_updated * 1000)
      .local();
    return (
      <p>{`${dateObject.format("DD")}/${dateObject.format(
        "MM"
      )}/${dateObject.format("YY")} - ${dateObject.format("HH:mm")}`}</p>
    );
  };

  renderHubspotExtensionModal = () => {
    if (!this.state.hubspotExtensionModal) return;

    return (
      <Modal
        show={this.state.hubspotExtensionModal}
        onClose={() => this.setState({ hubspotExtensionModal: false })}
        title={language.hubspotExtension}
        body={
          <div id="modal-for-hubspot-extension">
            <div>
              <p>{language.hubspotExtensionD}</p>
            </div>
          </div>
        }
      />
    );
  };

  renderToolbar = () => {
    const diagramModel = this.diagramEngine.getDiagramModel();
    const zoom = Math.round(diagramModel.zoom);
    return (
      <div className="dnd-toolbar">
        <p className="zoom">{zoom}%</p>
        <Slider
          value={zoom}
          max={100}
          min={20}
          onChange={(newZoom) => {
            events.track("Zoom navigation panel", { zoom: newZoom });
            diagramModel.setZoomLevel(newZoom);
            this.diagramEngine.forceUpdate();
            this.forceUpdate();
          }}
        />
        <div
          className={`toggle-cursor ${
            this.state.cursor === CURSOR_MODE_SELECT ? "active" : ""
          }`}
          onClick={() => {
            let newMode = CURSOR_MODE_SELECT;
            if (this.state.cursor == CURSOR_MODE_SELECT)
              newMode = CURSOR_MODE_MOVE;
            this.setState({ cursor: newMode });
            trackEvent("toggle cursor", { cursor: newMode });
          }}
        >
          <i className="icon icon--cursor" />
        </div>
        <div
          className="origin-shortcut"
          onClick={() => {
            events.track("Navigation panel find flow");
            zoomToContent(this.diagramEngine);
          }}
        >
          <i className="icon icon--finder" />
        </div>
      </div>
    );
  };

  renderConversationEvaluation() {
    const handleOpen = () => {
      this.setState({ conversationEvaluationOpen: false });
    };

    return (
      <ConversationEvaluation
        diagramEngine={this.diagramEngine}
        conversationEvaluationOpen={this.state.conversationEvaluationOpen}
        handleOpen={handleOpen.bind(this)}
        selectModalOption={(option, extra = []) => {
          this.setState({ modal: { type: option, extra } });
        }}
      />
    );
  }

  renderErrorModal() {
    return (
      <CustomModal
        show={this.state.errorModal ? true : false}
        onClose={() => {
          this.setState({ errorModal: null });
        }}
        title={
          <div className="title-with-icon">
            <div className="icon icon--mini-hubspot" />
            <h6>{language.modalErrorTitle}</h6>
          </div>
        }
        body={<p>{language.modalErrorBody}</p>}
        buttons={
          <>
            <button
              className="transparent"
              onClick={() => {
                this.setState({ errorModal: null });
              }}
            >
              {language.continueToEditor}
            </button>
            {this.state.errorModal == "helpdeskProperties" && (
              <button
                className="purple"
                onClick={() => {
                  events.track("Retry on fetch helpdesk properties");
                  this.props.fetchHelpdeskProperties(
                    this.props.helpdeskIntegrations,
                    () => {
                      this.setState({
                        errorModal: "helpdeskPropertiesIncomplete",
                      });
                      events.track(
                        "Failure on retry on fetch helpdesk properties"
                      );
                    }
                  );
                  this.setState({ errorModal: null });
                }}
              >
                {language.tryAgain}
              </button>
            )}
          </>
        }
        class={this.state.errorModal}
      />
    );
  }
  onClickConversationsTemplatesButton(option) {
    events.track("Click on conversation library modal", {
      option: option,
    });
    localStorage.setItem("showConversationsTemplatesModal", false);
    this.forceUpdate();
  }
  renderConversationsTemplatesModal() {
    if (!CONVERSATION_LIBRARY_TEST_COMPANIES.includes(me.id)) return;
    const showConversationsTemplatesModal = JSON.parse(
      localStorage.getItem("showConversationsTemplatesModal")
    );
    if (showConversationsTemplatesModal === false) return;
    return (
      <div className="conversations-templates-modal">
        <div className="flow-image"></div>
        <p>{language.conversationsTemplatesModalText}</p>
        <button
          className="principal"
          onClick={() => {
            window.open(
              "https://treble.notion.site/Libreria-de-templates-b98c14455b29427684b8504a26e08233",
              "_blank"
            );
            this.onClickConversationsTemplatesButton("interested");
          }}
        >
          {language.conversationsTemplatesModalButton1}
        </button>
        <button
          className="secondary"
          onClick={() => {
            this.onClickConversationsTemplatesButton("not interested");
          }}
        >
          {language.conversationsTemplatesModalButton2}
        </button>
      </div>
    );
  }
  renderCompleteLoader() {
    if (this.state.completeLoader == null) return;
    return (
      <div className="complete-page-loader">
        <div className="page-loader">
          <TrebleLoader />
          <p>{language[this.state.completeLoader]}</p>
        </div>
      </div>
    );
  }
  saveConversationDraft() {
    const diagramToBeSaved = this.diagramEngine
      .getDiagramModel()
      .serializeDiagram();
    this.props.saveConversationDraft(
      this.props.conversation.id,
      diagramToBeSaved,
      (data) => {
        if (data.message == "success") {
          this.props.conversation["draft_serialized_model"] =
            JSON.stringify(diagramToBeSaved);
          this.state.autoSave = "sync";
        } else {
          this.state.autoSave = "syncError";
        }
        this.forceUpdate();
      }
    );
  }
  autoSave() {
    if (
      !this.props.conversation?.draft_serialized_model ||
      ["loading", "notSync"].includes(this.state.autoSave) ||
      this.props.visualization == "published" ||
      !this.props.conversation.id
    )
      return;
    let currentDiagram = Object.assign(
      {},
      this.diagramEngine.getDiagramModel().serializeDiagram()
    );
    let lastSavedDiagram = Object.assign(
      {},
      JSON.parse(this.props.conversation.draft_serialized_model)
    );
    delete currentDiagram["offsetX"];
    delete currentDiagram["offsetY"];
    delete currentDiagram["zoom"];
    delete lastSavedDiagram["offsetX"];
    delete lastSavedDiagram["offsetY"];
    delete lastSavedDiagram["zoom"];
    if (JSON.stringify(currentDiagram) != JSON.stringify(lastSavedDiagram)) {
      this.setState({ autoSave: "notSync" }, () => {
        setTimeout(() => {
          this.setState({ autoSave: "loading" });
        }, 4000);
        setTimeout(this.saveConversationDraft, 8000);
      });
    }
  }
  render() {
    this.autoSave();
    return (
      <div className="main-frame" id="create-conversation-frame">
        {this.renderConversationsTemplatesModal()}
        {this.renderHubspotExtensionModal()}
        {this.renderErrorModal()}
        {this.renderHeader()}
        {this.renderCompleteLoader()}
        <div id="create-conversation-wrapper">
          <div
            id="diagram-widget-wrapper"
            className={`cursor-${
              this.state.cursor == "CURSOR_MODE_MOVE" ? "move" : "select"
            }`}
            onClick={() => {
              this.setState({ conversationEvaluationOpen: false });
            }}
          >
            {this.renderConfigurationPanel()}
            <DiagramWidget
              diagramEngine={this.diagramEngine}
              actions={{
                deleteItems: true,
              }}
              backgroundImage={{
                url: backgroundImage,
                width: BACKGROUND_IMAGE_WIDTH,
                height: BACKGROUND_IMAGE_HEIGHT,
              }}
              discretePosition={24}
              onChange={this.onChange}
              cursor={this.state.cursor}
            />
          </div>
          {this.renderToolbar()}
          {this.renderConversationEvaluation()}
          <EvaluationModalsComponent
            modal={this.state.modal}
            onClose={() => {
              this.setState({ modal: null });
            }}
            language={language}
            addNewNode={this.addNewCustomModal}
            automaticImprovement={this.automaticImprovement}
            diagramEngine={this.diagramEngine}
          />
          {this.renderGoalBlockModal()}
        </div>
      </div>
    );
  }
}
