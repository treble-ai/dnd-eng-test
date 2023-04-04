export const zoomToContent = (diagramEngine) => {
  let diagramModel = diagramEngine.diagramModel;
  let nodes = diagramModel.getNodes();
  if (Object.keys(nodes).length == 0) return;
  let leftNode = nodes[Object.keys(nodes)[0]].x;
  let upNode = nodes[Object.keys(nodes)[0]].y;
  let rightNode = nodes[Object.keys(nodes)[0]].x;
  let downNode = nodes[Object.keys(nodes)[0]].y;
  Object.values(nodes).forEach((node) => {
    if (node.x <= leftNode) {
      leftNode = node.x;
    }
    if (node.y <= upNode) {
      upNode = node.y;
    }
    if (node.x >= rightNode) {
      rightNode = node.x;
    }
    if (node.y >= downNode) {
      downNode = node.y;
    }
  });
  let verticalDistance = Math.abs(downNode - upNode);
  let horizontalDistance = Math.abs(rightNode - leftNode);
  diagramModel.offsetX = -leftNode;
  diagramModel.offsetY = -upNode;
  if (horizontalDistance > verticalDistance) {
    diagramModel.zoom = distanceToZoomX(horizontalDistance);
  } else {
    diagramModel.zoom = distanceToZoomY(verticalDistance);
  }
  diagramEngine.forceUpdate();
};

const distanceToZoomX = (distance) => {
  if (distance < 1500) {
    return 90;
  } else if (distance < 2000) {
    return 80;
  } else if (distance < 2500) {
    return 60;
  } else if (distance < 3200) {
    return 50;
  } else if (distance < 4000) {
    return 40;
  } else if (distance < 5000) {
    return 30;
  } else if (distance < 6000) {
    return 30;
  } else if (distance < 7000) {
    return 20;
  } else if (distance < 8000) {
    return 10;
  }
  return 1;
};

const distanceToZoomY = (distance) => {
  if (distance < 600) {
    return 90;
  } else if (distance < 800) {
    return 70;
  } else if (distance < 900) {
    return 60;
  } else if (distance < 1300) {
    return 50;
  } else if (distance < 2400) {
    return 30;
  } else if (distance < 3500) {
    return 20;
  } else if (distance < 4000) {
    return 10;
  } else if (distance < 5000) {
    return 5;
  }
  return 1;
};
