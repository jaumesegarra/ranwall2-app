import { useState } from 'react';

import { connect } from 'react-redux';
import { setProperties, reset } from '../../../actions/config';

import Native, { MACOS } from '../../../utils/native';
import WindowManager from '../../../utils/windowmanager';
import WallpaperManager from '../../../utils/wallpapermanager';

import Template from './Options.jsx';
import './Options.scss';

const { systemPreferences } = window.require("electron").remote;

const ALL_PROVIDERS = WallpaperManager.getAllProviders();

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

const Config = ({ config, setProperties, resetConfig }) => {
	const [tmpMagicShortcut, setTmpMagicShortcut] = useState(null);

	const setLaunchAtStartup = (e) => {
		let value = e.target.checked;

		WindowManager.launchAtStartup(value);
		setProperties({ launchAtStartup: value});
	}

	const setAutoDetectTheme = (e)=> {
		let value = e.target.checked;

		let properties = { autoDetectTheme: value };

		if(value)
			properties.darkTheme = systemPreferences.isDarkMode();

		setProperties(properties);
	}

	const setProviders = (e) => {
		let options = e.target.options;
		
		let value = [];

		for (let i = 0; i < options.length; i++)
			if (options[i].selected)
				value.push(options[i].value);

		if(value.length > 0)
			setProperties({ providers: value });
			
	}

	const setResolution = (pos, e) => {
		let value = e.target.value;

		let resolution = config.resolution;
		resolution[pos] = +value;
		setProperties({ resolution: resolution });
	}

	const setPredefinedResolution = opt => {
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

		setProperties({ resolution: value });
	}

	const setProperty = (name, e) => {
		let target = e.target;
		let value = target.type === 'checkbox' ? target.checked : target.value;

		setProperties({ [name]: value });
	}

	const onKeyUp = (e) => {
		e.preventDefault();

		let { modifiers, key } = tmpMagicShortcut;

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
			setProperties({ magicShortcutKeys: text });
			stopMagicShorcutKeys();
		}
		else
			setTmpMagicShortcut({
				key: key,
				modifiers: modifiers,
				text: text
			});
	}

	const recordMagicShorcutKeys = () => {
		if(!tmpMagicShortcut){
			setTmpMagicShortcut({
				key: null,
				modifiers: [],
				text: '- - -'
			});
		}else stopMagicShorcutKeys();
	}

	const stopMagicShorcutKeys = (e) => {
		if(tmpMagicShortcut){
			if(e){
				let { modifiers, key, text } = tmpMagicShortcut;

				if(is_valid_shortcut(key, modifiers)){
					setProperties({ magicShortcutKeys: text });
				}
			}

			setTmpMagicShortcut(null);
		}
	}

	const openCustomProvidersFile = (e) => {
		e.preventDefault();

		Native.openUserCustomProviders();
	}

	const resetApp = () => {
		resetConfig();

		Native.clearAppFolder().subscribe(res => {}, err => console.error(err));

		localStorage.clear();
	}

	return Template(config, Native.getSystem() === MACOS, ALL_PROVIDERS, setPredefinedResolution, {
		tmpKeys: (tmpMagicShortcut) ? tmpMagicShortcut.text : null,
		record: recordMagicShorcutKeys,
		stop: stopMagicShorcutKeys,
		onKeyUp: (tmpMagicShortcut !== null) ? onKeyUp : null
	}, openCustomProvidersFile, resetApp, {
		common: setProperty,
		launchAtStartup: setLaunchAtStartup,
		autoDetectTheme: setAutoDetectTheme,
		providers: setProviders,
		resolution: setResolution
	});
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Config);