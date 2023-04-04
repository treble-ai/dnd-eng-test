import _ from "lodash";
import { BaseEntity } from "./BaseEntity";

export class BaseModel extends BaseEntity {
  constructor() {
    super();
    this.selected = false;
    this.error = false;
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.selected = ob.selected;
    this.error = ob.error;
  }

  serialize() {
    return {
      ...super.serialize(),
      _class: this.className,
      selected: this.selected,
      error: this.error,
    };
  }

  getID() {
    return this.id;
  }

  isSelected() {
    return this.selected;
  }

  isError() {
    return this.error;
  }

  setSelected(selected) {
    this.selected = selected;
    this.itterateListeners((listener) => {
      if (listener.selectionChanged) {
        listener.selectionChanged(this, selected);
      }
    });
  }

  setError(error) {
    this.error = error;
  }

  remove() {
    this.itterateListeners((listener) => {
      if (listener.entityRemoved) {
        listener.entityRemoved(this);
      }
    });
  }

  update(propertyName, propertyValue) {
    this.itterateListeners((listener) => {
      if (listener.entityUpdated) {
        listener.entityUpdated(propertyName, propertyValue);
      }
    });
  }
}

export class PointModel extends BaseModel {
  constructor(link, points) {
    super();
    this.x = points.x;
    this.y = points.y;
    this.link = link;
    this.className = "PointModel";
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.x = ob.x;
    this.y = ob.y;
  }

  serialize() {
    return {
      ...super.serialize(),
      x: this.x,
      y: this.y,
    };
  }

  remove() {
    super.remove();

    // Clear references
    if (this.link) {
      this.link.removePoint(this);
    }
  }

  updateLocation(points) {
    this.x = points.x;
    this.y = points.y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getLink() {
    return this.link;
  }
}

export class LinkModel extends BaseModel {
  constructor(linkType = "default") {
    super();
    this.linkType = linkType;
    this.points = this.getDefaultPoints();
    this.extras = {};
    this.sourcePort = null;
    this.targetPort = null;
    this.className = "LinkModel";
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.linkType = ob.type;
    this.points = ob.points.map((point) => {
      var p = new PointModel(this, { x: point.x, y: point.y });
      p.deSerialize(point);
      return p;
    });
    this.webhook = ob.webhook;
  }

  serialize() {
    return {
      ...super.serialize(),
      webhook: this.webhook,
      type: this.linkType,
      source: this.sourcePort ? this.sourcePort.getParent().id : null,
      sourcePort: this.sourcePort ? this.sourcePort.id : null,
      target: this.targetPort ? this.targetPort.getParent().id : null,
      targetPort: this.targetPort ? this.targetPort.id : null,
      points: this.points.map((point) => point.serialize()),
      extras: this.extras,
    };
  }

  remove() {
    super.remove();
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
  }

  isLastPoint(point) {
    return this.getPointIndex(point) === this.points.length - 1;
  }

  getDefaultPoints() {
    return [
      new PointModel(this, { x: 0, y: 0 }),
      new PointModel(this, { x: 0, y: 0 }),
    ];
  }

  getPointIndex(point) {
    return this.points.indexOf(point);
  }

  getPointModel(id) {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].id === id) {
        return this.points[i];
      }
    }
    return null;
  }

  getFirstPoint() {
    return this.points[0];
  }

  getLastPoint() {
    return this.points[this.points.length - 1];
  }

  setSourcePort(port) {
    port.addLink(this);
    this.sourcePort = port;
  }

  getSourcePort() {
    return this.sourcePort;
  }

  getTargetPort() {
    return this.targetPort;
  }

  setTargetPort(port) {
    port.addLink(this);
    this.targetPort = port;
  }

  getPoints() {
    return this.points;
  }

  setPoints(points) {
    this.points = points;
  }

  removePoint(pointModel) {
    this.points.splice(this.getPointIndex(pointModel), 1);
  }

  addPoint(pointModel, index = 1) {
    this.points.splice(index, 0, pointModel);
  }

  getType() {
    return this.linkType;
  }
}

export class PortModel extends BaseModel {
  constructor(name) {
    super();
    this.name = name;
    this.links = {};
    this.parentNode = null;
    this.className = "PortModel";
    this.showLinkRoute = false;
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.name = ob.name;
    this.showLinkRoute = ob.showLinkRoute;
  }

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
      parentNode: this.parentNode.id,
      links: _.map(this.links, (link) => link.id),
      showLinkRoute: this.showLinkRoute,
    };
  }

  getShowLinkRoute() {
    return this.showLinkRoute;
  }

  setShowLinkRoute(showLinkRoute) {
    this.showLinkRoute = showLinkRoute;
  }

  getName() {
    return this.name;
  }

  getParent() {
    return this.parentNode;
  }

  setParentNode(node) {
    this.parentNode = node;
  }

  removeLink(link) {
    delete this.links[link.getID()];
  }

  addLink(link) {
    this.links[link.getID()] = link;
  }

  getLinks() {
    return this.links;
  }
}

export class NodeModel extends BaseModel {
  constructor(nodeType = "default") {
    super();
    this.nodeType = nodeType;
    this.x = 0;
    this.y = 0;
    this.extras = {};
    this.ports = {};
    this.className = "NodeModel";
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.nodeType = ob.type;
    this.x = ob.x;
    this.y = ob.y;
    this.extras = ob.extras;
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.nodeType,
      x: this.x,
      y: this.y,
      extras: this.extras,
      ports: _.map(this.ports, (port) => port.serialize()),
    };
  }

  remove() {
    super.remove();
    for (const key in this.ports) {
      _.forEach(this.ports[key].getLinks(), (link) => link.remove());
    }
  }

  getPort(id) {
    return this.ports[id];
  }

  cleanPorts() {
    this.ports = {};
  }

  getPorts() {
    return this.ports;
  }

  getPortFromID(id) {
    const ports = this.ports;

    return id in this.ports ? this.ports[id] : null;
  }

  removePort(port) {
    // Clear the parent node reference
    if (this.ports[port.id]) {
      _.forEach(port.getLinks(), (link) => link.remove());
      this.ports[port.id].setParentNode(null);
      delete this.ports[port.id];
    }
  }

  addPort(port) {
    port.setParentNode(this);
    this.ports[port.id] = port;
    super.update("add-port", port);
    return port;
  }

  getType() {
    return this.nodeType;
  }
}

export class NodePortModel extends BaseModel {
  constructor(nodeType = "default") {
    super();
    this.nodeType = nodeType;
    this.x = 0;
    this.y = 0;
    this.extras = {};
    this.ports = [];
    this.className = "NodePortModel";
  }

  deSerialize(ob) {
    super.deSerialize(ob);
    this.nodeType = ob.type;
    this.x = ob.x;
    this.y = ob.y;
    this.extras = ob.extras;
    this.attr = ob.attr;
    if (ob.file)
      this.file = {
        url: ob.file.url,
        type: ob.file.type,
      };
    this.webhook_delivered = ob.webhook_delivered;
    this.webhook_read = ob.webhook_read;
  }

  serialize() {
    return {
      ...super.serialize(),
      attr: this.attr,
      type: this.nodeType,
      file: this.file && {
        url: this.file.url,
        type: this.file.type,
      },
      x: this.x,
      y: this.y,
      extras: this.extras,
      ports: this.ports.map((port) => port.serialize()),
      webhook_read: this.webhook_read,
      webhook_delivered: this.webhook_delivered,
    };
  }

  remove() {
    super.remove();

    const ports = this.ports;

    for (var i = 0; i < ports.length; i++) {
      const port = ports[i];
      _.forEach(port.getLinks(), (link) => link.remove());
    }
  }

  getPortFromID(id) {
    const ports = this.ports;

    for (var i = 0; i < ports.length; i++) {
      const port = ports[i];
      if (port.id === id) {
        return port;
      }
    }

    return null;
  }

  getPort(name) {
    const ports = this.ports;

    for (var i = 0; i < ports.length; i++) {
      const port = ports[i];
      if (port.name === name) {
        return port;
      }
    }

    return null;
  }

  getPorts() {
    return this.ports;
  }

  removePort(port) {
    // Clear the parent node reference

    const ports = this.ports;

    let index = -1;

    for (var i = 0; i < ports.length; i++) {
      const portActual = ports[i];
      if (portActual === port) {
        portActual.setParentNode(null);
        index = i;
      }
    }

    ports.splice(index, 1);
    this.ports = ports;
  }

  addPort(port) {
    port.setParentNode(this);
    this.ports.push(port);
    return port;
  }

  getType() {
    return this.nodeType;
  }
}
