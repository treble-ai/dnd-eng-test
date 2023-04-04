import React from "react";
import _ from "lodash";

export class NodeWidget extends React.Component {
  shouldComponentUpdate() {
    return this.props.diagramEngine.canEntityRepaint(this.props.node);
  }

  render() {
    const { node, children, diagramEngine, discretePosition } = this.props;
    let x = this.props.node.x;
    let y = this.props.node.y;

    if (discretePosition) {
      x = Math.floor(x / discretePosition) * discretePosition;
      y = Math.floor(y / discretePosition) * discretePosition;
    }

    const props = {
      "data-nodeid": node.id,
      className: `node ${this.props.node.isSelected() ? " selected" : ""} ${
        this.props.node.isError() ? "error" : ""
      }`,

      style: {
        top: y,
        left: x,
      }
    };

    // Pass the diagramEngine to the node
    const items = _.isArray(children)
      ? children.map((child) => React.cloneElement(child, { diagramEngine }))
      : React.cloneElement(children, { diagramEngine });

    return <div {...props}>{items}</div>;
  }
}
