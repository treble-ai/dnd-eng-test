import React, { Component } from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

/*
	props:
		- imageName str: name of image for the tooltip
		- title str: title to be display on tooltip
		- message str: message to be display
		- placement str: placement of tooltip
		- itemtohover obj: html object with item selected to have tooltip. Example:
		- buttons, i, span, etc
		- NOTE: if the item has funcionality use the following optional props:
			- onChange function(obj)
*/

const ImageTooltip = props =>{

	const renderTooltip = ()=>{
      return (
        <Tooltip className= "alternative-flux-tooltip">
          <div className = "all-text-container">
            <div className= "image-container">
              <i className = {`image image--${props.imageName}`}/>
            </div>
            <div className= "text-container">
              <h6>
                {props.title}
              </h6>
              <p className ="r">
                {props.message}
              </p>
            </div>
          </div>
        </Tooltip>
      );
  }
  	const handleHoverItem = () =>{
  		if (props.itemtohover.type == "i"){
  			return <i className = {`${props.itemtohover.props['className']}`}/>
  		} else if (props.itemtohover.type== 'button'){

  			return(
  				<button className={`${props.itemtohover.props['className']}`} onClick = {typeof props.onClick === 'function'? props.onClick: null}>
			          	{props.buttonText}
				</button>

  				)

  		} else if (props.itemtohover.type == 'div'){
  			return (
  				<div
  				className={`${props.itemtohover.props['className']}`}
  				data-name={props.itemtohover.props['data-name']?`${props.itemtohover.props['data-name']}`: null}
  				data-nodeid={props.itemtohover.props['data-nodeid']?`${props.itemtohover.props['data-nodeid']}`:null}
            	/>

  				)
  		}
  	}

	const constructTooltip = () => {
	return(
	  <OverlayTrigger
	    placement={props.placement}
	    delay={{ show: 250, hide: 400}}
	    overlay={renderTooltip()}
        onToggle={props.onToggle}
	  >
	   {handleHoverItem()}
	  </OverlayTrigger>
	  );
	}


return(
	<div >
	{constructTooltip()}
	</div>
	);

};

export default ImageTooltip;