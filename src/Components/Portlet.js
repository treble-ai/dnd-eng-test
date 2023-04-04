import React, { Component } from 'react';

import './Loader.scss'

/*
--- STYLES --
success
warning
danger
info
primary
secondary
*/

export default class Portlet extends Component {
	constructor () {
		super();
	}


	render(){

		var style_classname = 'm-portlet';
		if (this.props.headstyle) style_classname += ' m-portlet--head-solid-bg m-portlet--' + this.props.headstyle;

		var border_color = { 
			'border-color': '#ebedf2',
		};
		return (
			<div className={ style_classname }>
				<div className="m-portlet__head">
					<div className="m-portlet__head-caption">
						<div className="m-portlet__head-title">
							<h3 className="m-portlet__head-text">
								{ this.props.title } <small>{ this.props.subtitle }</small>
							</h3>
						</div>			
					</div>
				</div>
				<div className="m-portlet__body">
					{ this.props.children }
				</div>
				<div className="m-portlet__foot" style={ border_color }>
					{ this.props.footer }
				</div>
			</div>
		)
	}
}