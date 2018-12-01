import React from 'react';
import { connect } from 'react-redux';
import { setProperty } from '../../../actions/config';

import Native, { MACOS } from '../../../utils/native';
import WindowManager from '../../../utils/windowmanager';

import Template from './Options.jsx';
import './Options.scss';

const { systemPreferences } = window.require("electron").remote;

const mapStateToProps = state => {
	return {
		config: state.config
	}
}

const mapDispatchToProps = dispatch => ({
	setProperty: (name, value) => dispatch(setProperty(name, value))
});

class Options extends React.Component {
	shouldComponentUpdate = (nextProps, nextState) => {
		return nextProps.config !== this.props.config;
	}

	setLaunchAtStartup = (e)=> {
		let value = e.target.checked;

		WindowManager.launchAtStartup(value);
		this.props.setProperty('launchAtStartup', value);
	}

	setAutoDetectTheme = (e)=> {
		let value = e.target.checked;

		if(value)
			this.props.setProperty('darkTheme', systemPreferences.isDarkMode());

		this.props.setProperty('autoDetectTheme', value);
	}

	setProperty = (name, e) => {
		let target = e.target;
		let value = target.type === 'checkbox' ? target.checked : target.value;

		this.props.setProperty(name, value);
	}

	render = () => Template(this.props.config, this.setProperty, Native.getSystem() === MACOS, this.setLaunchAtStartup, this.setAutoDetectTheme);
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);