import React, { Component } from "react";

import "./Sidebar.scss";

export class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.show) return null;
    return (
      <div className={`sidebar ${this.props.class}`}>
        <div className="content-sidebar">
          <div className="header">
            <div className="title">{this.props.title}</div>
            <div
              className="icon icon--close"
              onClick={() => this.props.close()}
            />
          </div>
          <div className="body">{this.props.body}</div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
