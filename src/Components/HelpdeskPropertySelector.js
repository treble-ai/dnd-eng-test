import React from "react";
import { useSelector } from "react-redux";
import SearchableDropdown from "Components/SearchableDropdown";
import { Modifier, EditorState } from "draft-js";

const HelpdeskPropertySelector = (props) => {
  let helpdeskProperties =
    useSelector(
      (state) =>
        state.conversationReducer.helpdeskProperties?.contacts?.properties
    ) ?? [];

  const filteredHelpdeskProperties = props.notReadOnlyVariables
    ? helpdeskProperties.filter((variable) => !variable.read_only)
    : helpdeskProperties;

  const addText = ({ value }) => {
    const { editorState, onChange } = props;

    value = `{{${value}}}`;

    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      value,
      editorState.getCurrentInlineStyle()
    );

    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };

  const onSelectOption = (selection) => {
    if (typeof props.onSelect == "function") {
      return props.onSelect(selection);
    } else {
      return addText({ value: `hubspot_${selection.value}` });
    }
  };

  return (
    <div className="btn-add-hubspot-variable">
      <SearchableDropdown
        styleMode={props.styleMode}
        searchPlaceholder={props.searchPlaceholder}
        className={"onlyIconSearchableDropdow"}
        options={filteredHelpdeskProperties}
        displayItem={(item) => (
          <p className="textItem">{`{{${item.value}}}`}</p>
        )}
        toSearchStr={(item) => item.value}
        onSelect={onSelectOption}
        triggerComponent={<div className="imgIcon"></div>}
      />
    </div>
  );
};

export default HelpdeskPropertySelector;
