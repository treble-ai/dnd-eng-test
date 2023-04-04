import React from "react";
import { PointModel } from "../Common";

export class DefaultLinkWidget extends React.Component {
  static defaultProps = {
    color: "#6464FF",
    width: 2,
    link: null,
    engine: null,
    smooth: false,
    diagramEngine: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  generatePoint(pointIndex) {
    const { link } = this.props;
    const uiCircleProps = {
      className: `point pointui${
        link.points[pointIndex].isSelected() ? " selected" : ""
      }`,
      cx: link.points[pointIndex].x,
      cy: link.points[pointIndex].y,
      r: 5,
    };
    const circleProps = {
      className: "point",
      "data-linkid": link.id,
      "data-id": link.points[pointIndex].id,
      cx: link.points[pointIndex].x,
      cy: link.points[pointIndex].y,
      r: 15,
      opacity: 0,
      onMouseLeave: () => this.setState({ selected: false }),
      onMouseEnter: () => this.setState({ selected: true }),
    };

    return (
      <g key={`point-${link.points[pointIndex].id}`}>
        <circle {...uiCircleProps} />
        <circle {...circleProps} />
      </g>
    );
  }

  generateLink(extraProps) {
    const { link, width, color } = this.props;
    const { selected } = this.state;
    let className = "";
    if (link.targetPort == null && !selected) {
      className = "ready-to-contect";
    } else if (selected || link.selected) {
      className = "selected";
    }
    const bottom = (
      <path
        className={className}
        strokeWidth={width}
        strokeLinecap="round"
        stroke={color}
        {...extraProps}
      />
    );

    const top = (
      <path
        strokeLinecap={"round"}
        data-linkid={link.getID()}
        stroke={"white"}
        strokeOpacity={selected ? 0.1 : 0}
        strokeWidth={20}
        onMouseLeave={() => this.setState({ selected: false })}
        onMouseEnter={() => this.setState({ selected: true })}
        onContextMenu={(event) => {
          event.preventDefault();
          this.props.link.remove();
        }}
        {...extraProps}
      />
    );

    return (
      <g key={`link-${extraProps.id}`}>
        {bottom}
        {top}
      </g>
    );
  }

  getAdjustedPosition({ x, y }) {
    const diagramModel = this.props.diagramEngine.diagramModel;
    const currentZoomLevel = diagramModel.getZoomLevel();
    const offsetProportion = 100 / currentZoomLevel;

    const getScrollOffset = (side) =>
      document
        .getElementsByClassName("node-view")[0]
        .parentElement.getBoundingClientRect()[side] -
      document.getElementsByClassName("node-view")[0].getBoundingClientRect()[
        side
      ];

    const scrollOffsetY = getScrollOffset("top");
    const scrollOffsetX = getScrollOffset("left");

    return {
      x: x + scrollOffsetX * offsetProportion,
      y: y + scrollOffsetY * offsetProportion,
    };
  }
  
  drawLine() {
    const { link } = this.props;
    const { points } = link;
    let paths = [];

    let pointLeft = points[0];
    let pointRight = points[1];

    // Some defensive programming to make sure the smoothing is
    // Always in the right direction
    // if (pointLeft.x > pointRight.x) {
    //   pointLeft = points[1];
    //   pointRight = points[0];
    // }

    // let path = ` M${pointLeft.x} ${pointLeft.y} C${pointLeft.x + margin} ${pointLeft.y} ${pointRight.x - margin} ${pointRight.y} ${pointRight.x} ${pointRight.y}`

    let path = null;
    const arrowOffset = 10;

    if (pointLeft.x > pointRight.x) {
      const distanceOffset = 40;

      let topElement = pointLeft.y > pointRight.y ? pointLeft : pointRight;
      let bottomElement = pointLeft.y > pointRight.y ? pointRight : pointLeft;
      let midWayY = (topElement.y - bottomElement.y) / 2 + bottomElement.y;

      let pointRightXOffset = pointRight.x - 10;

      path = `M${pointLeft.x} ${pointLeft.y}
       L${pointLeft.x + distanceOffset + 20} ${pointLeft.y}
       M${pointLeft.x + distanceOffset + 20} ${pointLeft.y}
       L${pointLeft.x + distanceOffset + 20} ${midWayY}
       M${pointLeft.x + distanceOffset + 20} ${midWayY}
       L${pointRight.x - distanceOffset} ${midWayY}
       M${pointRight.x - distanceOffset} ${midWayY}
       L${pointRight.x - distanceOffset} ${pointRight.y}
       M${pointRight.x - distanceOffset} ${pointRight.y}
       L${pointRightXOffset} ${pointRight.y}
       M${pointRightXOffset} ${pointRight.y} 
       L${pointRightXOffset - arrowOffset} ${pointRight.y - arrowOffset} 
       M${pointRightXOffset} ${pointRight.y} 
       L${pointRightXOffset - arrowOffset} ${pointRight.y + arrowOffset}`;
    } else {
      let midWayX = (pointRight.x - pointLeft.x) / 2 + pointLeft.x;
      let pointRightXOffset = pointRight.x - 10;

      path = `M${pointLeft.x} ${pointLeft.y}
      L${midWayX} ${ pointLeft.y}
      M${midWayX} ${ pointLeft.y}
      L${midWayX} ${pointRight.y} 
      M${midWayX} ${pointRight.y} 
      L${pointRightXOffset} ${pointRight.y} 
      M${pointRightXOffset} ${pointRight.y} 
      L${pointRightXOffset - arrowOffset} ${pointRight.y - arrowOffset} 
      M${pointRightXOffset} ${pointRight.y} 
      L${pointRightXOffset - arrowOffset} ${pointRight.y + arrowOffset}`;
    }

    paths.push(
      this.generateLink({
        id: 0,
        d: path, // eslint-disable-line
      })
    );

    if (link.targetPort === null) {
      paths.push(this.generatePoint(1));
    }

    return paths;
  }

  drawAdvancedLine() {
    const { link, smooth, diagramEngine, pointAdded } = this.props;
    const { points } = link;

    const ds = [];

    if (smooth) {
      ds.push(
        ` M${points[0].x} ${points[0].y} C ${points[0].x + 50} ${points[0].y} ${
          points[1].x
        } ${points[1].y} ${points[1].x} ${points[1].y}` // eslint-disable-line
      );

      let i;
      for (i = 1; i < points.length - 2; i++) {
        ds.push(
          ` M ${points[i].x} ${points[i].y} L ${points[i + 1].x} ${
            points[i + 1].y
          }`
        );
      }

      ds.push(
        ` M${points[i].x} ${points[i].y} C ${points[i].x} ${points[i].y} ${
          points[i + 1].x - 50
        } ${points[i + 1].y} ${points[i + 1].x} ${points[i + 1].y}` // eslint-disable-line
      );
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        ds.push(
          ` M ${points[i].x} ${points[i].y} L ${points[i + 1].x} ${
            points[i + 1].y
          }`
        );
      }
    }

    const paths = ds.map((data, index) =>
      this.generateLink({
        id: index,
        d: data,
        "data-linkid": link.id,
        "data-point": index,
        onMouseDown: (event) => {
          if (!event.shiftKey) {
            const point = new PointModel(
              link,
              diagramEngine.getRelativeMousePoint(event)
            );
            point.setSelected(true);
            this.forceUpdate();
            link.addPoint(point, index + 1);
            pointAdded(point, event);
          }
        },
      })
    );

    // Render the circles
    for (let i = 1; i < points.length - 1; i++) {
      paths.push(this.generatePoint(i));
    }

    if (link.targetPort === null) {
      paths.push(this.generatePoint(points.length - 1));
    }

    return paths;
  }

  render() {
    const { points } = this.props.link;
    let paths = [];

    // Draw the line
    if (points.length === 2) {
      paths = this.drawLine();
    } else {
      paths = this.drawAdvancedLine();
    }

    let label = null;
    if (this.props.link.label != undefined) {
      let pointLeft = this.getAdjustedPosition(points[0]);
      let pointRight = this.getAdjustedPosition(points[1]);

      // Some defensive programming to make sure the smoothing is
      // Always in the right direction
      if (pointLeft.x > pointRight.x) {
        pointLeft = this.getAdjustedPosition(points[1]);
        pointRight = this.getAdjustedPosition(points[0]);
      }

      // label = (
      //     <text className="label-survey" x={(pointLeft.x + pointRight.x)/2} y={(pointLeft.y + pointRight.y)/2}>{this.props.link.label}</text>
      // )

      label = (
        <foreignobject
          x={(pointLeft.x + pointRight.x) / 2}
          y={(pointLeft.y + pointRight.y) / 2}
          width="1000"
          height="1000"
        >
          <div>I'm a div inside a SVG.</div>
        </foreignobject>
      );
    }

    return (
      <g>
        {label}
        {paths}
      </g>
    );
  }
}
