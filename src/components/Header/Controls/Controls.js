import React from 'react';
import './Controls.scss';
import Template from './Controls.jsx';
import WindowManager from '../../../utils/windowmanager.js';

const { app } = window.require('electron').remote;

export default class Controls extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
	
	close(e){
		e.preventDefault();
		app.exit();
	}

	minimize(e){
		e.preventDefault();
		WindowManager.hide(true);
	}

	render = () => Template(this.close, this.minimize);
}