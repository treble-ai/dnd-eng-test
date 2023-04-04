import React, { Component } from 'react';

import './styles.scss';

/*
props:
	type: Should be any of these
		- warning
		- error
		- success
		- info
		- question
	onAccept: callback when accept button is clicked
	onCancel: callback when cancel button is clicked
	acceptText: accept button text
	cancelText: cancel button text
*/
export default class Alert extends Component {
	constructor(props){
		super(props);

		this.state = {
			show: false,
			removed: true,
		}

		this.hide.bind(this);
	}

	componentDidMount(){
		this.setState({
			show: this.props.show,
		})
	}
	/************************************************************************************************************************
	 ************************************************************************************************************************
	 ************************************************************************************************************************/

	hide() {
		this.setState({show:false});
		setTimeout(()=> {
			this.setState({removed: true});
		},0.5)
	}

	onCancel() {
		if (this.props.onCancel)
			this.props.onCancel()
	}

	onAccept() {
		if (this.props.onAccept)
			this.props.onAccept()
	}

	onDismiss() {
		if (this.props.onDismiss)
			this.props.onDismiss()
	}

	render(){

		if (!this.props.show && this.state.show)
			this.hide()

		if (this.props.show && !this.state.show) {
			this.setState({
				show: true,
				removed: false
			});
		}

		if (this.state.removed) return (<div></div>);

		let type_image = {
			"question" : (<div class="swal2-icon swal2-question" style={{display: "flex"}}>
				            <span class="swal2-icon-text">?</span>
				          </div>),
			"warning" : (<div class="swal2-icon swal2-warning swal2-animate-warning-icon" style={{display: "flex"}}>
				            <span class="swal2-icon-text">!</span>
				         </div>),
			"info" : (<div class="swal2-icon swal2-info" style={{display: "flex"}}>
				            <span class="swal2-icon-text">i</span>
				      </div>),
			"error": (<div class="swal2-icon swal2-error" style={{display: "flex"}}>
			            <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span>
			            <span class="swal2-x-mark-line-right"></span></span>
			         </div>),
			"success": (<div class="swal2-icon swal2-success" style={{display: "flex"}}>
				            <div class="swal2-success-circular-line-left" style={{"background-color": "rgb(255, 255, 255)"}}>
				            </div>
				            <span class="swal2-success-line-tip"></span>
				            <span class="swal2-success-line-long"></span>
				            <div class="swal2-success-ring">
				            </div>
				            <div class="swal2-success-fix" style={{"background-color": "rgb(255, 255, 255)"}}>
				            </div>
				            <div class="swal2-success-circular-line-right" style={{"background-color": "rgb(255, 255, 255)"}}>
				            </div>
				        </div>),
		}


		let background_classes = "swal2-container swal2-center swal2-fade";
		if (this.state.show)  background_classes += " swal2-shown";


		let modal_classes = "swal2-popup swal2-modal";
		if (this.state.show) modal_classes += " swal2-show";
		else modal_classes += " swal2-hide";

		let acceptBtn;
		if (this.props.acceptText)
			acceptBtn =  (<button type="button" class="swal2-confirm btn btn-success m-btn m-btn--custom" aria-label="" onClick={() => this.onAccept()}>{this.props.acceptText}</button>);

		let cancelBtn;
		if (this.props.cancelText)
			cancelBtn =  (<button type="button" onClick={() => this.onCancel()} class="swal2-cancel btn btn-secondary m-btn m-btn--custom" aria-label="" style={{display: "inline-block", color: "#212529"}}>{this.props.cancelText}</button>);
			

		return (
			<div class={background_classes} style={{"overflow-y": "auto"}}>
				<div aria-labelledby="swal2-title" aria-describedby="swal2-content" class={modal_classes} tabindex="-1" role="dialog" aria-live="assertive" aria-modal="true" style={{width: "400px", padding: "2.5rem", display: "flex"}}>
				    <div class="swal2-header">
				        <ul class="swal2-progresssteps" style={{display: "none"}}></ul>
				        { (this.props.type? type_image[this.props.type] : null) }
				        <img class="swal2-image" style={{display: "none"}}/>
				        <h2 class="swal2-title" id="swal2-title" style={{display: "flex"}}>{this.props.title}</h2>
				        <button type="button" class="swal2-close" onClick={() => this.onDismiss()}>×</button>
				    </div>
				    <div class="swal2-content">
				        <div id="swal2-content" style={{display: "block"}}>{this.props.text}</div>
				        <input class="swal2-input" style={{display: "none"}}/>
				        <input type="file" class="swal2-file" style={{display: "none"}} />
				        <div class="swal2-range" style={{display: "none"}}>
				            <input type="range" />
				            <output></output>
				        </div>
				        <select class="swal2-select" style={{display: "none"}}></select>
				        <div class="swal2-radio" style={{display: "none"}}></div>
				        <label for="swal2-checkbox" class="swal2-checkbox" style={{display: "none"}}>
				            <input type="checkbox"/><span class="swal2-label"></span>
				        </label>
				        <textarea class="swal2-textarea" style={{display: "none"}}></textarea>
				        <div class="swal2-validationerror" id="swal2-validationerror" style={{display: "none"}}></div>
				        {this.props.children}
				    </div>
				    <div class="swal2-actions" style={{display: "flex"}}>
				    	{ acceptBtn }
				        { cancelBtn }
				    </div>
				    <div class="swal2-footer" style={{display: "none"}}></div>
				</div>
			</div>
		)
	}	
}