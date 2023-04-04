import React from "react";
import "./PercentageBar.scss";

/*
	props:
    - width int: width of chart
    - porcentage int: color porcentage on chart
*/

const PercentageBar = (props) => {


  return (

    <div className = 'graph' style = {{width: `${props.width}px`}} >
        <div style = {{width: `${props.width}px`}} className = 'grey-background'></div>
        <div style = {{width: `${props.width * props.percentage}px`}} className = 'color-bar'></div>
    </div>
  );
};

export default PercentageBar;