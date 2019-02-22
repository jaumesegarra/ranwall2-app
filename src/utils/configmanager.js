import store from '../store';
import { loadConfig } from '../actions/config';
import Native from './native';

const { BrowserWindow } = window.require('electron').remote;

let configWindow;

export default class ConfigManager {

	static localToState(){
		let data = localStorage.getItem("config");
		if(data)
			store.dispatch(loadConfig(JSON.parse(data)));
	}

	static watcher(){
		window.addEventListener('storage', ConfigManager.localToState);
	}

	static openWindow(){
		if(!configWindow){
			configWindow = new BrowserWindow({
				title: 'ranwall: Configuration',
				width: 485,
				height: 310,
				resizable:false,
				fullscreen: false,
				show: false,
				webPreferences: { 
			      nodeIntegration: true
			    }
			});
			configWindow.loadURL((Native.isDev() ? 'http://localhost:3000' : `file://${Native.getResource('index.html')}`) + '#config');

			if(Native.isDev())
    			configWindow.openDevTools();

			configWindow.once('ready-to-show', () => {
				configWindow.show()
			})

			configWindow.on('closed', function () {
				configWindow = undefined;
			})
		}else configWindow.focus();
	}
}