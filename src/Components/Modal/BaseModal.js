import React from 'react';

import './BaseModal.scss';

/*
props
	active
*/
export default (props) => (
	<div className={'base-modal ' + 
	(props.active?'base-modal-active':'')
	} onClick={props.onDismiss}>
	    { props.children }
	</div>
)