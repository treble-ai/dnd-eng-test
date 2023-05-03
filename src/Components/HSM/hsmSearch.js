import React, { Component, useEffect, useState } from "react";
import languages from "../languages.js";
import getLanguage from "getLanguage.js";
import TextInput from "Components/TextInput";
import { connect } from "react-redux";

// Ant Design
import { Menu, Tooltip } from "antd";
import "antd/dist/antd.css";
import "./hsmSearch.scss";

const language = languages[getLanguage()];

const { SubMenu } = Menu;

const HsmSearch = ({
  setCurrentNode,
  hsmList,
  renderHsm,
  setTemplate
}) => {
  const [searchbarHsm, setState] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchTerm = (String(searchbarHsm) || "").toLowerCase();

    const filteredHsms = hsmList.filter((hsm) =>
      (hsm.name + hsm.content).toLowerCase().includes(searchTerm)
    );

    setResults(filteredHsms);
  }, [searchbarHsm]);

  const renderHsms = () => {
    if (results.length > 0) {
      return (
        <div className="hsm-template-results">
          {results.map((hsm) => (
            <div
              key={hsm.id}
              className="hsm-item-container"
              onMouseEnter={() => setCurrentNode(hsm)}
              onMouseLeave={() => setCurrentNode(false)}
              onClick={()=>{setTemplate(hsm)}}
            >
              <div
                overlayClassName={`hsm ${hsm.status}`}
                placement="rightBottom"
                title={renderHsm(hsm)}
              >
                <div className={`hsm ${hsm.status}`}>
                  {hsm.status == "PAUSED" && (
                    <div className="paused-hsm">
                      <p>{language.hsmPaused}</p>
                    </div>
                  )}
                  <h1>{hsm.name}</h1>
                  <h2>{hsm.content}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="hsm-no-results">
          <div className="no-results-image" />
          <div className="no-result-title">{language.noResults}</div>
          <div className="subtitle">{language.noHsm}</div>
        </div>
      );
    }
  };

  const renderSearchbar = () => {
    return (
      <div className="searchbar">
        <p className="control has-icons-left has-icons-right">
          <TextInput
            className="input"
            type="text"
            onChange={({ target: { value } }) => {
              setState(value);
            }}
            value={searchbarHsm}
            trackMessage="Search HSM to add"
            placeholder={language.hsmPH}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search"></i>
          </span>
        </p>
      </div>
    );
  };
  return (
    <div className="hsm-template-container">
      {renderSearchbar()}
      {renderHsms()}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { conversationReducer } = state;
  return {
    hsmList: conversationReducer.hsmList,
  };
};

export default connect(mapStateToProps, null)(HsmSearch);
