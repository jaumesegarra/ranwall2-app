import React from 'react';
import './Header.scss';
import Template from './Header.jsx';

import WallpaperManager from '../../../utils/wallpapermanager';
import ConfigManager from '../../../utils/configmanager';

export default class Header extends React.PureComponent {
	
	newWallpaper(){
		WallpaperManager.new();
	}

	openConfig(){
		ConfigManager.openWindow();
	}

	render = () => Template(this.newWallpaper, this.openConfig);
}