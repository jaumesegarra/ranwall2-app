import React from 'react';
import './Controls.scss';
import WindowManager from '../../../../utils/windowmanager';

const { app } = window.require('electron').remote;

const Controls = () => {
	
	const close = (event) => {
		event.preventDefault();
		app.exit();
	}

	const minimize = (event) => {
		event.preventDefault();
		WindowManager.hide(true);
	}

	return (
	   <div className="controls">
	   		<button id="close" title="Close" onClick={close}>
	   			<span>
	   				&times;
	   			</span>
	   		</button>
	    	<button id="minimize" title="Minimize" onClick={minimize}>
	    		<span>
	    			&ndash;
	    		</span>
	    	</button>
	   </div>
	);
}

export default Controls;