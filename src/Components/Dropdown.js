import React, { PureComponent } from 'react';

/*
--- STYLES --
	success
	warning
	danger
	info
	primary
	secondary
*/

export default class Dropdown extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			'display' : false,
		}
	}

	toggle() {
		if (this.props.onToggle) this.props.onToggle();
		this.setState({
			'display' : !this.state.display,
		})
	}

	render() {
		var display = this.state.display;
		if (this.props.display !== undefined) display = this.props.display;

		var display_style = {
			'display' : (display? 'block' : 'none'),
			'zIndex': '101',
		}
		return (
			<div className={this.props.className + " m-dropdown m-dropdown--inline m-dropdown--align-left m-dropdown--open"} m-dropdown-toggle="hover" aria-expanded="true">
                <a className="m-dropdown__toggle btn dropdown-toggle" onClick={() => this.toggle()}>
                    { this.props.text }
                </a>
                <div className="m-dropdown__wrapper" style={display_style}>
                    <div className="m-dropdown__inner">
                        <div className="m-dropdown__body">              
                            <div className="m-dropdown__content">
                                <div className="m-scrollable" data-scrollable="true" data-height="200" style={{ 'overflow': 'auto'}}>
                                    { this.props.children }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
}