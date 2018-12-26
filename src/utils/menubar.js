import AutoUpdaterManager from './autoupdatermanager';
import ConfigManager from './configmanager';

const { app, Menu } = window.require('electron').remote;

const MENU_OPTIONS = [{
	label: app.getName(),
	submenu: [
	{
		role: 'about'
	},
	{
		label: 'Check for updates...',
		click: AutoUpdaterManager.checkAgain
	},
	{
		type: 'separator'
	},
	{
		label: 'Configuration...',
		click: ConfigManager.openWindow
	},
	{
		type: 'separator'
	},
	{
		role: 'services',
		submenu: []
	},
	{
		type: 'separator'
	},
	{
		role: 'hide'
	},
	{
		role: 'hideothers'
	},
	{
		role: 'unhide'
	},
	{
		type: 'separator'
	},
	{
		role: 'quit'
	}
	]
},
{
	role: 'window',
	submenu: [
	{
		role: 'minimize'
	},
	{
		role: 'close'
	}
	]
},
{
	role: 'help',
	submenu: [
	{
		label: 'Learn More',
		click () { window.require('electron').shell.openExternal('https://github.com/jaumesegarra/ranwall2-app') }
	}
	]
}];

export default class MenuBar{
	static create(){
		const menu = Menu.buildFromTemplate(MENU_OPTIONS)
		Menu.setApplicationMenu(menu);
	}
}
