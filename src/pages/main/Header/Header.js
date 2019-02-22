import React from 'react';
import './Header.scss';

import WindowManager from '../../../utils/windowmanager';
import WallpaperManager from '../../../utils/wallpapermanager';
import ConfigManager from '../../../utils/configmanager';

import Controls from './Controls/Controls';

const Header = () => {
	const hideWindow = () => WindowManager.hide(true);
	const newWallpaper = () => WallpaperManager.new().subscribe();
	const openConfig = () => ConfigManager.openWindow();

	return (
	   <div className="header" onDoubleClick={hideWindow}>
	   		<Controls />

	   		<h1>ranwall</h1>

	   		<button id="refresh" title="Refresh" onClick={newWallpaper}>
	   			<i className="fa fa-refresh"></i>
	   		</button>
	        <button id="config" title="Configuration" onClick={openConfig}>
	        	<i className="fa fa-cog"></i>
	        </button>
	   </div>
	);
}

export default Header;