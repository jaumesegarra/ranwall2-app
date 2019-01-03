import store from '../store';

import Native, { MACOS } from './native';
import WindowManager from './windowmanager';
import WallpaperManager from './wallpapermanager';
import AutoUpdaterManager from './autoupdatermanager';
import ConfigManager from './configmanager';

const { app, Menu, Tray } = window.require('electron').remote;

const IMAGE = `./trayIcon_${(Native.getSystem() === MACOS) ? 'macos.png' : 'win.ico'}`;
const OPTIONS = [
	{
		label: 'Set new wallpaper!', 
		accelerator: store.getState().config.magicShortcutKeys,
		click: () => { 
			WallpaperManager.new(true, true);
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Show/Hide', 
		click: WindowManager.toggleShow
	},
	{
		label: 'Configuration', 
		click: ConfigManager.openWindow
	},
	{
		label: 'Check for updates', 
		click: AutoUpdaterManager.checkAgain
	},
	{
		label: 'Exit', 
		click: app.exit
	},
];

export default class TrayMenu{
	static _object = null;

	static create(){
		let tray = new Tray(Native.getResource(IMAGE));

		const contextMenu = Menu.buildFromTemplate(OPTIONS);
		contextMenu.items[1].checked = false;

		tray.setContextMenu(contextMenu);

		if(Native.getSystem() !== MACOS)
			tray.on('click', WindowManager.show);

		TrayMenu._object = tray;

		window.addEventListener('beforeunload', function(){ TrayMenu.destroy()});
	}

	static destroy(){
		TrayMenu._object.destroy();
	}
}