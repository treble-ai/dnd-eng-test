import React, { Component } from 'react';

import './styles.scss';

export default class DemoLanding extends Component {
	constructor(props){
		super(props);

		this.state = {
			'visible' : false
		}

		this.backgroundClick = this.backgroundClick.bind(this);
	}

	componentDidMount(){

	}

	backgroundClick(e){
		if (this.props.lock)
			return

		if (e.target.id === 'background'){
			this.setState({visible : false});
		}
	}

	toggle(visible) {
		if (this.props.lock && visible) {
			if (localStorage.getItem('reauthed') !== null){
				return
			} else {
				this.setState({visible})	
			}
		} else {
			this.setState({visible})
		}
	}

	showDemo(){
		this.setState({visible : true});
	}

	/************************************************************************************************************************
	 ************************************************************************************************************************
	 ************************************************************************************************************************/

	render(){
		if (!this.state.visible){
			return null;
		}

		const classname = (this.props.class) ? `modal-content ${this.props.class}` : 'modal-content'

		return (
			<div className="modal-demo" id="background" onClick={e => this.backgroundClick(e)}>
				<div className={classname}>
					{this.props.children}
				</div>
			</div>
		)
	}	
}