import React from "react";

import { NodeWidgetFactory } from "DDCanvas/main";

import { QuestionNodeWidget } from "../Widgets/QuestionNodeWidget";
import QuestionOpenNodeContainer from "../Widgets/QuestionOpenNodeContainer";
import QuestionClosedNodeContainer from "../Widgets/QuestionClosedNodeContainer";
import QuestionClosedButtonsNodeContainer from "../Widgets/QuestionClosedButtonsNodeContainer";
import QuestionClosedListNodeContainer from "../Widgets/QuestionClosedListNodeContainer";
import { ConditionalNodeWidget } from "../Widgets/ConditionalNodeWidget";
import { ABNodeWidget } from "../Widgets/ABNodeWidget";
import { AgentNodeWidget } from "../Widgets/AgentNodeWidget";
import { HubSpotAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/HubSpotAgentNodeWidget";
import { ZendeskAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/ZendeskAgentNodeWidget";
import { FreshdeskAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/FreshdeskAgentNodeWidget";
import { KustomerAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/KustomerAgentNodeWidget";
import { CustomAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/CustomAgentNodeWidget";
import { IntercomAgentNodeWidget } from "../Widgets/Integrations/Helpdesk/IntercomAgentNodeWidget";
import { HSMNodeWidget } from "../Widgets/HSMNodeWidget";
import { PollRedirectionNodeWidget } from "../Widgets/PollRedirectionNodeWidget";
import HelpdeskActionNodeWidget from "../Widgets/HelpdeskActionNodeWidget";
import HelpdeskTicketNodeWidget from "../Widgets/HelpdeskTicketNodeWidget";

export class AgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("agent");
  }

  generateReactWidget(diagramEngine, node) {
    return <AgentNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class HubSpotAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("HubSpotAgent");
  }

  generateReactWidget(diagramEngine, node) {
    return <HubSpotAgentNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class FreshdeskAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("FreshdeskAgent");
  }
  generateReactWidget(diagramEngine, node) {
    return (
      <FreshdeskAgentNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class KustomerAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("KustomerAgent");
  }
  generateReactWidget(diagramEngine, node) {
    return (
      <KustomerAgentNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}
export class ZendeskAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("ZendeskAgent");
  }
  generateReactWidget(diagramEngine, node) {
    return <ZendeskAgentNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}
export class CustomAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("CustomAgent");
  }
  generateReactWidget(diagramEngine, node) {
    return <CustomAgentNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class IntercomAgentWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("IntercomAgent");
  }
  generateReactWidget(diagramEngine, node) {
    return (
      <IntercomAgentNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class QuestionWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question");
  }

  generateReactWidget(diagramEngine, node) {
    return <QuestionNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class ConditionalNodeWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-node-conditional");
  }

  generateReactWidget(diagramEngine, node) {
    return <ConditionalNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class ABNodeWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-node-ab");
  }

  generateReactWidget(diagramEngine, node) {
    return <ABNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class QuestionOpenWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question-open");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <QuestionOpenNodeContainer node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class QuestionClosedWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question-closed");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <QuestionClosedNodeContainer node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class QuestionClosedButtonsWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question-closed-buttons");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <QuestionClosedButtonsNodeContainer
        node={node}
        diagramEngine={diagramEngine}
      />
    );
  }
}

export class QuestionClosedListWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question-closed-list");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <QuestionClosedListNodeContainer
        node={node}
        diagramEngine={diagramEngine}
      />
    );
  }
}

export class HSMWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-question-hsm");
  }

  generateReactWidget(diagramEngine, node) {
    return <HSMNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}

export class PollRedirectionWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-poll-redirection");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <PollRedirectionNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class HelpdeskActionNodeWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-helpdesk-action");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <HelpdeskActionNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}

export class HelpdeskTicketNodeWidgetFactory extends NodeWidgetFactory {
  constructor() {
    super("default-helpdesk-ticket");
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <HelpdeskTicketNodeWidget node={node} diagramEngine={diagramEngine} />
    );
  }
}
