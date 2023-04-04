import { AbstractInstanceFactory } from "DDCanvas/main";

import { QuestionNodeModel } from "../Models/QuestionNodeModel";
import { QuestionClosedNodeModel } from "../Models/QuestionClosedNodeModel";
import { QuestionClosedButtonsNodeModel } from "../Models/QuestionClosedButtonsNodeModel";
import { QuestionClosedListNodeModel } from "../Models/QuestionClosedListNodeModel";
import { QuestionOpenNodeModel } from "../Models/QuestionOpenNodeModel";
import { ConditionalNodeModel } from "../Models/ConditionalNodeModel";
import { ABNodeModel } from "../Models/ABNodeModel";
import { AgentNodeModel } from "../Models/AgentNodeModel";
import { HubSpotAgentNodeModel } from "../Models/Integrations/Helpdesk/HubSpotAgentNodeModel";
import { ZendeskAgentNodeModel } from "../Models/Integrations/Helpdesk/ZendeskAgentNodeModel";
import { FreshdeskAgentNodeModel } from "../Models/Integrations/Helpdesk/FreshdeskAgentNodeModel";
import { KustomerAgentNodeModel } from "../Models/Integrations/Helpdesk/KustomerAgentNodeModel";
import { CustomAgentNodeModel } from "../Models/Integrations/Helpdesk/CustomAgentNodeModel";
import { IntercomAgentNodeModel } from "../Models/Integrations/Helpdesk/IntercomAgentNodeModel";
import { HSMNodeModel } from "../Models/HSMNodeModel";
import { PollRedirectionNodeModel } from "../Models/PollRedirectionNodeModel";
import { HelpdeskActionNodeModel } from "../Models/HelpdeskActionNodeModel";
import { HelpdeskTicketNodeModel } from "../Models/HelpdeskTicketNodeModel";

export class QuestionNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("QuestionNodeModel");
  }

  getInstance() {
    return new QuestionNodeModel();
  }
}

export class QuestionOpenNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("QuestionOpenNodeModel");
  }

  getInstance() {
    return new QuestionOpenNodeModel();
  }
}

export class QuestionClosedNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("QuestionClosedNodeModel");
  }

  getInstance() {
    return new QuestionClosedNodeModel();
  }
}

export class QuestionClosedButtonsNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("QuestionClosedButtonsNodeModel");
  }

  getInstance() {
    return new QuestionClosedButtonsNodeModel();
  }
}

export class QuestionClosedListNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("QuestionClosedListNodeModel");
  }

  getInstance() {
    return new QuestionClosedListNodeModel();
  }
}

export class ConditionalNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("ConditionalNodeModel");
  }

  getInstance() {
    return new ConditionalNodeModel();
  }
}

export class ABNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("ABNodeModel");
  }

  getInstance() {
    return new ABNodeModel();
  }
}

export class AgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("AgentNodeModel");
  }

  getInstance() {
    return new AgentNodeModel();
  }
}

export class HubSpotAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("HubSpotAgentNodeModel");
  }

  getInstance() {
    return new HubSpotAgentNodeModel();
  }
}
export class FreshdeskAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("FreshdeskAgentNodeModel");
  }

  getInstance() {
    return new FreshdeskAgentNodeModel();
  }
}

export class KustomerAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("KustomerAgentNodeModel");
  }

  getInstance() {
    return new KustomerAgentNodeModel();
  }
}
export class ZendeskAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("ZendeskAgentNodeModel");
  }

  getInstance() {
    return new ZendeskAgentNodeModel();
  }
}
export class CustomAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("CustomAgentNodeModel");
  }

  getInstance() {
    return new CustomAgentNodeModel();
  }
}
export class IntercomAgentNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("IntercomAgentNodeModel");
  }

  getInstance() {
    return new IntercomAgentNodeModel();
  }
}
export class HSMNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("HSMNodeModel");
  }

  getInstance() {
    return new HSMNodeModel();
  }
}

export class PollRedirectionNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("PollRedirectionNodeModel");
  }

  getInstance() {
    return new PollRedirectionNodeModel();
  }
}

export class HelpdeskActionNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("HelpdeskActionNodeModel");
  }

  getInstance() {
    return new HelpdeskActionNodeModel();
  }
}

export class HelpdeskTicketNodeFactory extends AbstractInstanceFactory {
  constructor() {
    super("HelpdeskTicketNodeModel");
  }

  getInstance() {
    return new HelpdeskTicketNodeModel();
  }
}
