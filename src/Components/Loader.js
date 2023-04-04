import React, { Component } from 'react';

import './Loader.scss'

export default class Loader extends Component {
	constructor () {
		super();

		this.state = {
			visible : false
		}
	}

	show(){
		this.setState({
			visible : true
		})
	}

	hide(){
		this.setState({
			visible : false
		})	
	}

	componentWillMount() {
	}

	render(){
		if (!this.state.visible)
			return null

		let loader_class = "m-loader m-loader--danger";
		if (this.props.treble)
			loader_class = "treble-logo";

		return (
			<div className="treble-loader">
				<div className={ loader_class } style={ {display: 'inline-block'} }></div>
			</div>
		)
	}
}