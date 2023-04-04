import React, { Component } from 'react';

import './Switch.scss';

export default class Switch extends Component {
	constructor () {
		super();
	}

	clicked(e) {
		e.preventDefault();
		if (typeof this.props.onChange === 'function')
			this.props.onChange(!this.props.active)
	}
	render(){

		return (
			<span className="m-switch m-switch--outline m-switch--success" onClick={this.clicked.bind(this)}>
				<label>
	            <input type="checkbox" checked={this.props.active && 'checked'} name="" onChange={() => {}} />
	            <span></span>
	            </label>
	        </span>
		)
	}
}