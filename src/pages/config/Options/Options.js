import React from 'react';
import { connect } from 'react-redux';
import { setProperties, reset } from '../../../actions/config';

import PROVIDERS from '../../../constants/providers';

import Native, { MACOS } from '../../../utils/native';
import WindowManager from '../../../utils/windowmanager';

import Template from './Options.jsx';
import './Options.scss';

const { systemPreferences } = window.require("electron").remote;

function is_valid_shortcut(ms, ks){	
	return (ms && ks && ks.length === 2);
}

const mapStateToProps = state => {
	return {
		config: state.config
	}
}

const mapDispatchToProps = dispatch => ({
	setProperties: (values) => dispatch(setProperties(values)),
	resetConfig: () => dispatch(reset())
});

class Options extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			tmpMagicShortcut: null	
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return nextProps.config !== this.props.config || nextState.tmpMagicShortcut !== this.state.tmpMagicShortcut;
	}

	setLaunchAtStartup = (e)=> {
		let value = e.target.checked;

		WindowManager.launchAtStartup(value);
		this.props.setProperties({ launchAtStartup: value});
	}

	setAutoDetectTheme = (e)=> {
		let value = e.target.checked;

		let properties = { autoDetectTheme: value };

		if(value)
			properties.darkTheme = systemPreferences.isDarkMode();

		this.props.setProperties(properties);
	}

	setProviders = (e) => {
		let options = e.target.options;
		
		let value = [];

		for (let i = 0; i < options.length; i++)
			if (options[i].selected)
				value.push(options[i].value);

		if(value.length > 0)
			this.props.setProperties({ providers: value });
			
	}

	setResolution = (pos, e) => {
		let value = e.target.value;

		let resolution = this.props.config.resolution;
		resolution[pos] = +value;
		this.props.setProperties({ resolution: resolution });
	}

	setPredefinedResolution = opt => {
		let value;

		switch (opt) {
			case 0:
			value = Native.getScreenResolution();
			break;
			case 1: 
			value = [1920, 1080];
			break;
			case 2:
			value = [3840, 2160];
			break;
			default:
			break;
		}

		this.props.setProperties({ resolution: value });
	}

	setProperty = (name, e) => {
		let target = e.target;
		let value = target.type === 'checkbox' ? target.checked : target.value;

		this.props.setProperties({ [name]: value });
	}

	onKeyUp = (e) => {
		e.preventDefault();

		let { modifiers, key } = this.state.tmpMagicShortcut;

		let keyPressed = e.key.replace("Meta", "Command")

		if(e.key === "Meta" || e.key === "Control" || e.key === "Alt" || e.key === "Shift"){
			switch (modifiers.length) {
				case 0:
				modifiers[0] = keyPressed;
				break;
				case 1:
				if(modifiers[0] !== keyPressed)
					modifiers[1] = keyPressed;
				break;
				default:
				modifiers = [];
				modifiers[0] = keyPressed;
				key = null;
				break;
			}
		}else if(modifiers.length === 2 && (new RegExp("^[a-zA-Z]$").test(e.key) || new RegExp("^F[1-9]$").test(e.key)))
		key = e.key.toUpperCase();

		let text = '- - -';
		if(modifiers.length > 0){
			text = modifiers[0];

			if(modifiers.length === 2){
				text += '+'+modifiers[1];

				if(key)
					text += '+'+key;
				else
					text += ' -';
			}else text += ' - -';
		}

		if(is_valid_shortcut(key, modifiers)){
			this.props.setProperties({ magicShortcutKeys: text });
			this.stopMagicShorcutKeys();
		}
		else
			this.setState({
				tmpMagicShortcut: {
					key: key,
					modifiers: modifiers,
					text: text
				}
			});
	}

	recordMagicShorcutKeys = () => {
		if(!this.state.tmpMagicShortcut){
			this.setState({
				tmpMagicShortcut: {
					key: null,
					modifiers: [],
					text: '- - -'
				}
			});
		}else this.stopMagicShorcutKeys();
	}

	stopMagicShorcutKeys = (e) => {
		if(this.state.tmpMagicShortcut){
			if(e){
				let { modifiers, key, text } = this.state.tmpMagicShortcut;

				if(is_valid_shortcut(key, modifiers)){
					this.props.setProperties({ magicShortcutKeys: text });
				}
			}

			this.setState({
				tmpMagicShortcut: null
			});
		}
	}

	resetApp = () => {
		this.props.resetConfig();

		Native.clearAppFolder().subscribe(res => {
			console.log('IT WORKS!');
		}, err => console.error(err));

		localStorage.clear();
	}

	render = () => Template(this.props.config, Native.getSystem() === MACOS, PROVIDERS, this.setPredefinedResolution, {
		tmpKeys: (this.state.tmpMagicShortcut) ? this.state.tmpMagicShortcut.text : null,
		record: this.recordMagicShorcutKeys,
		stop: this.stopMagicShorcutKeys,
		onKeyUp: (this.state.tmpMagicShortcut !== null) ? this.onKeyUp : null
	}, this.resetApp, {
		common: this.setProperty,
		launchAtStartup: this.setLaunchAtStartup,
		autoDetectTheme: this.setAutoDetectTheme,
		providers: this.setProviders,
		resolution: this.setResolution
	});
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);