import React from 'react';
import './Header.scss';
import Template from './Header.jsx';

import WindowManager from '../../../utils/windowmanager';
import WallpaperManager from '../../../utils/wallpapermanager';
import ConfigManager from '../../../utils/configmanager';

export default class Header extends React.PureComponent {
	hideWindow() {
		WindowManager.hide(true);
	}

	newWallpaper(){
		WallpaperManager.new();
	}

	openConfig(){
		ConfigManager.openWindow();
	}

	render = () => Template(this.hideWindow, this.newWallpaper, this.openConfig);
}