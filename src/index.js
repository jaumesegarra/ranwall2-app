import React from 'react';
import ReactDOM from 'react-dom';
import 'line-awesome/css/line-awesome.min.css';
import './index.scss';
import App from './App';

import { Provider } from 'react-redux';
import store from './store';

import Native, { MACOS } from './utils/native.js';
import MenuBar from './utils/menubar.js';
import TrayMenu from './utils/traymenu.js';
import WindowManager from './utils/windowmanager.js';
import ConfigManager from './utils/configmanager';

if(Native.getSystem() === MACOS){
	MenuBar.create();
	WindowManager.autoChangeTheme();
}

TrayMenu.create();
WindowManager.overlayMinimizeEvent();
ConfigManager.localToState();
ConfigManager.watcher();

ReactDOM.render(
    <Provider store={store}>
    	<App />
    </Provider>, 
document.getElementById('root'));