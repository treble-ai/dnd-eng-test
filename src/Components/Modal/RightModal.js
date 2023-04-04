import React from 'react';

import './RightModal.scss';

import BaseModal from './BaseModal';

/*
props
	active
	width
*/
export default (props) => (
	<BaseModal {...props}>
		<div class={'right-modal ' + (props.active? 'right-modal-active' :'') }
		style={{ 'width':props.width }}
		onClick={(e) => e.stopPropagation() }>
			{ props.children} 	       
		</div>	
	</BaseModal>
);
