import Native, { MACOS } from './native';
import WindowManager from './windowmanager';
import ConfigManager from './configmanager';

const { app, Menu, Tray } = window.require('electron').remote;

const IMAGE = `./trayIcon_${(Native.getSystem() === MACOS) ? 'macos' : 'win'}.png`;
const OPTIONS = [
	{
		label: 'Set new wallpaper!', 
		accelerator: 'Shift+CmdOrCtrl+W',
		click: () => { 
		
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
		click: () => {

		}
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

		TrayMenu._object = tray;

		window.addEventListener('beforeunload', function(){ TrayMenu.destroy()});
	}

	static destroy(){
		TrayMenu._object.destroy();
	}
}