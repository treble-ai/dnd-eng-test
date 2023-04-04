import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import events from "utils/events";
import StickyPopover from "./StickyPopover";

import "./Novelties.scss";

export const NEW_FEATURE = "NEW_FEATURE";
export const IMPROVEMENT = "IMPROVEMENT";

const categoryToText = {
  NEW_FEATURE: "newFeature",
  IMPROVEMENT: "improvement",
};

const categoryToEmoji = {
  NEW_FEATURE: "🚀",
  IMPROVEMENT: "🔥",
};

export default class Novelties extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  renderCategory = (category) => {
    return (
      <p className={`category ${category}`}>
        {categoryToEmoji[category]}{" "}
        {this.props.language[categoryToText[category]].toUpperCase()}
      </p>
    );
  };

  renderNovelty = (novelty) => {
    return (
      <div>
        <div className="header">
          {this.renderCategory(novelty.category)}
          {this.renderCarouselIndicator()}
        </div>
        <h5>{novelty.title}</h5>
        <div className="media-container">{novelty.media}</div>
        <p className="description">{novelty.description}</p>
      </div>
    );
  };

  renderCarouselIndicator = () => {
    return (
      <div className="carousel-dots">
        {this.props.novelties.map((n, idx) => {
          return (
            <figure
              className={`carousel-dot ${
                this.state.index === idx ? "active" : ""
              }`}
              onClick={() => this.handleSelect(idx, null)}
            ></figure>
          );
        })}
      </div>
    );
  };

  handleSelect = (selectedIndex, e) => {
    events.track("Novelties carousel index change", {
      feature: this.props.novelties[selectedIndex].title,
    });
    this.setState({ index: selectedIndex });
  };

  renderViewNoveltiesExternal = () => {
    return (
      <div className="external">
        <a
          href={this.props.language.noveltiesLink}
          target="_blank"
          onClick={() => {
            events.track("Click on novelties see how it works", {
              feature: this.props.novelties[this.state.index].title,
            });
          }}
        >
          {this.props.language.seeExternalNovelties}
        </a>
      </div>
    );
  };

  render = () => {
    return (
      <StickyPopover
        placement="right-end"
        onMouseEnter={() => {
          events.track("Hover on novelties", {});
        }}
        className="novelties"
        component={
          <>
            <Carousel
              activeIndex={this.state.index}
              indicators={false}
              controls={false}
              onSelect={this.handleSelect}
              interval={null}
            >
              {this.props.novelties.map((n) => {
                return <Carousel.Item>{this.renderNovelty(n)}</Carousel.Item>;
              })}
            </Carousel>
            {this.renderViewNoveltiesExternal()}
          </>
        }
      >
        {this.props.children}
      </StickyPopover>
    );
  };
}
