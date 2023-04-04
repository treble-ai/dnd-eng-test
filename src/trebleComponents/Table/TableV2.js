import React, { Component } from "react";

import Table from "react-bootstrap/Table";

import "./styles.scss";

/*
  props:
    - headers list[str]: headers of table
    - atributes list[str]: atributes of table
    - data list[obj]: data to fill table
    - displayCell function(obj, str) -> component: tells table how to display element
  
*/
const TableV2 = (props) => {
  const renderTDElement = (user) => {
    return props.atributes.map((attr) => {
      return (
        <td className={` attribute attribute-${attr}`} key={`${Math.random()*1000}`}>
          {" "}
          {props.displayCell(user, attr)}
        </td>
      );
    });
  };
  const renderTable = () => {
    return (
      <Table responsive borderless size="xl">
        <thead>
          <tr>
            {props.headers.map((head) => {
              return (
                <th key={`header-${head}`} className={`header-${head}`}>
                  {head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => {
            return <tr key={`${Math.random()*1000}`}>{renderTDElement(user)}</tr>;
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="startOfTable">
      <div className="almostTable">
        <div className="table-container">{renderTable()}</div>
      </div>
    </div>
  );
};

export default TableV2;
