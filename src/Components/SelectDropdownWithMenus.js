import React, { Component } from "react";

import SelectDropdown from "./SelectDropdown";
import { OverlayTrigger, Overlay, Tooltip, Popover } from "react-bootstrap";

import "./SelectDropdown.scss";

/*
  props:
    -- categories list(obj): categories of the menus OPTIONAL
    -- options list(obj): total options of the menus 
    -- filterCategoryBy function(obj): Determine how are the options grouped in the menus // (category) => category.value
    -- filterOptionBy
    -- displayCategory function(obj): Determines what is shown in the dropdown OPTIONAL
    -- displaySubTitle function(obj): Determines what is shown in the popover title OPTIONAL ELSE displayCategory
    -- displayOption function(obj): Determines what is shown in the popover body
    -- hasTooltip OPTIONAL
    -- displayTooltip function(obj): Determines what is shown in the tooltip OPTIONAL
    -- triggerComponent Component/Str: If specified the component is used to trigger the dropdown instead of a button
    -- onSelectOption function(obj): to be called when a popover option is clicked OPTIONAL
    -- menuWidth int: width of the dropdown menu OPTIONAL
    -- className str: class identifier for css
    -- direction str: direction to open the first menu
*/

export default class SelectDropdownWithMenus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      openCategory: "",
    };
  }

  createCategories = () => {
    if (this.props.categories) {
      return this.props.categories;
    } else {
      let categories = [];
      this.props.options.map((opt) => {
        let tmpCategory = this.props.filterOptionBy(opt);
        if (!categories.includes(tmpCategory)) {
          categories.push(tmpCategory);
        }
      });
      return categories;
    }
  };

  checkCategory = (category) => {
    if (this.state.openCategory === category && this.state.open === true) {
      this.setState({ open: false });
    } else if (
      this.state.openCategory === category &&
      this.state.open === false
    ) {
      this.setState({ open: true });
    } else if (
      this.state.openCategory !== category &&
      this.state.open === true
    ) {
      this.setState({ openCategory: category, open: true });
    } else {
      this.setState({ openCategory: category, open: !this.state.open });
    }
  };

  toggleSubmenu = (category) => {
    if (category === this.state.openCategory) {
      return this.state.open;
    } else {
      return false;
    }
  };

  renderSingleCategory = (category, options) => {
    let singleCategory = "";
    if (this.props.displayCategory) {
      let displayCategory = this.props.displayCategory;
      if (typeof displayCategory !== "function")
        displayCategory = (category, options) => category;
      singleCategory = displayCategory(category, options);
    } else {
      singleCategory = category;
    }
    return singleCategory;
  };

  renderSubtitle = (category) => {
    if (this.props.displaySubtitle) {
      let displaySubtitle = this.props.displaySubtitle;
      if (typeof displaySubtitle !== "function")
        displaySubtitle = (category) => category;
      return (
        <Popover.Title>
          <div onClick={() => this.setState({ open: false })}>
            {displaySubtitle(category)}
          </div>
        </Popover.Title>
      );
    } else {
      return;
    }
  };

  renderOptionItem = (option, categoryIdentifier, optionIndex) => {
    let onSelectOption = this.props.onSelectOption;
    if (typeof onSelectOption !== "function")
      onSelectOption = (option) => option;
    let displayOption = this.props.displayOption;
    if (typeof displayOption !== "function") displayOption = (option) => option;
    return (
      <div
        id={`option-${categoryIdentifier}-${optionIndex}`}
        key={`option-KEY-${categoryIdentifier}-${optionIndex}`}
        className="popover-item"
        onClick={() => (
          this.setState({
            open: !this.state.open,
            openCategory: "",
          }),
          onSelectOption(option)
        )}
      >
        {displayOption(option)}
      </div>
    );
  };

  renderOption = (option, categoryIdentifier, optionIndex) => {
    if (this.props.hasTooltip === true) {
      let displayTooltip = this.props.displayTooltip;
      if (typeof displayTooltip !== "function")
        displayTooltip = (option) => option;
      return (
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          id={`OT-${categoryIdentifier}-${optionIndex}`}
          key={`OTK-${categoryIdentifier}-${optionIndex}`}
          overlay={
            <Tooltip
              className={this.props.className}
              id={`tooltip-${categoryIdentifier}-${optionIndex}`}
              target={`option-${categoryIdentifier}-${optionIndex}`}
            >
              {displayTooltip(option)}
            </Tooltip>
          }
        >
          {this.renderOptionItem(option, categoryIdentifier, optionIndex)}
        </OverlayTrigger>
      );
    } else {
      return this.renderOptionItem(option, categoryIdentifier, optionIndex);
    }
  };

  renderMenu = (categories) => {
    let renderedMenu = [];
    categories.map((cat) => {
      const categoryIdentifier = this.props.filterCategoryBy(cat);
      renderedMenu.push(
        <>
          <div
            id={`category-${categoryIdentifier}`}
            onClick={() => this.checkCategory(categoryIdentifier)}
          >
            {this.renderSingleCategory(cat, this.props.options)}
          </div>
          <Overlay
            target={document.getElementById(`category-${categoryIdentifier}`)}
            show={this.toggleSubmenu(categoryIdentifier)}
            placement="right"
            id={`overlay-${categoryIdentifier}`}
            rootClose={true}
            onHide={() => this.setState({ open: false })}
            transition={false}
          >
            {(props) => (
              <Popover
                {...props}
                id={`popover-${categoryIdentifier}`}
                className={this.props.className}
              >
                {this.renderSubtitle(cat)}
                <Popover.Content>
                  {this.props.options.map((opt, index) => {
                    if (typeof this.props.filterOptionBy(opt) === "object") {
                      if (
                        this.props
                          .filterOptionBy(opt)
                          .includes(categoryIdentifier)
                      ) {
                        return this.renderOption(
                          opt,
                          categoryIdentifier,
                          index
                        );
                      }
                    }
                    if (typeof this.props.filterOptionBy(opt) === "string") {
                      if (
                        this.props.filterOptionBy(opt) === categoryIdentifier
                      ) {
                        return this.renderOption(
                          opt,
                          categoryIdentifier,
                          index
                        );
                      }
                    }
                  })}
                </Popover.Content>
              </Popover>
            )}
          </Overlay>
        </>
      );
    });
    return renderedMenu;
  };

  handleChange = (attribute) => {
    let propsObj = Object.assign({}, this.props);
    return (e) => {
      if (e.target) {
        propsObj[attribute](e.target.value);
      } else {
        propsObj[attribute](e);
      }
    };
  };

  render = () => {
    const categories = this.createCategories();
    const menu = this.renderMenu(categories);
    let triggerComponent = this.props.triggerComponent;
    if (typeof triggerComponent !== "string") {
      return (
        <SelectDropdown
          options={menu}
          display={this.props.displayDropdown}
          onSelect={() => this.handleChange("openCategory")}
          hideOnOptionClick={false}
          hideOnClickOutside={false}
          menuWidth={this.props.menuWidth}
          triggerComponent={triggerComponent}
          direction={this.props.direction}
        ></SelectDropdown>
      );
    } else {
      return (
        <SelectDropdown
          options={menu}
          noSelectionTitle={triggerComponent}
          display={this.props.displayDropdown}
          onSelect={() => this.handleChange("openCategory")}
          hideOnOptionClick={false}
          hideOnClickOutside={false}
          menuWidth={this.props.menuWidth}
          direction={this.props.direction}
        ></SelectDropdown>
      );
    }
  };
}
