import { BaseAction } from "./BaseAction";

export class DragAnswerAction extends BaseAction {
  constructor(mouseX, mouseY, dragAnswer, diagramModel) {
    super(mouseX, mouseY);
    let nodeElement = dragAnswer.closest(".node[data-nodeid]");
    let node = diagramModel.getNode(nodeElement.getAttribute("data-nodeid"));
  }
}
