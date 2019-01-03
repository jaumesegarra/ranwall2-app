import Native from './native';
import WallpaperManager from './wallpapermanager';
import store from '../store';
import { setProperties } from '../actions/config';

const { app, systemPreferences, globalShortcut } = window.require('electron').remote;
const autoLaunch = window.require("auto-launch");

export default class WindowManager{

	static toggleShow(){
		if(MAIN_WINDOW.isVisible())
			WindowManager.hide();
		else
			WindowManager.show();
	}

	static overlayMinimizeEvent(){
		MAIN_WINDOW.on('minimize', (e) => {
			e.preventDefault();

			WindowManager.hide(true);
		});
	}

	static _hideNotification;

	static show(){
		MAIN_WINDOW.setSkipTaskbar(false);
		
		if(app.dock)
			app.dock.show();
		
		MAIN_WINDOW.show();
	}

	static hide(showNotification = false){
		MAIN_WINDOW.setSkipTaskbar(true);

		if(app.dock)
			app.dock.hide();

		MAIN_WINDOW.hide();

		if(showNotification && !WindowManager._hideNotification)
			WindowManager._hideNotification = Native.showNotification("App is hide!", "This app is hide, click to show!", WindowManager.show, () => delete WindowManager._hideNotification, true);
		
	}

	static autoChangeTheme(){
		systemPreferences.subscribeNotification(
		    'AppleInterfaceThemeChangedNotification',
		    () => {
		        let allowAutoChange = store.getState().config.autoDetectTheme;

		        if(allowAutoChange)
		            store.dispatch(setProperties({ darkTheme: systemPreferences.isDarkMode() }));
		    }
		)
	}

	static checkIfLaunchAtStartup(){
		new autoLaunch({
			name: 'ranwall',
			path: Native.getAppPath(),
			isHidden: true
		}).isEnabled().then(isEnabled => {
			store.dispatch(setProperties({ launchAtStartup: isEnabled }));
		})
	}

	static launchAtStartup(isEnabled){
		let ranwallAutoLauncher = new autoLaunch({
			name: 'ranwall',
			path: Native.getAppPath(),
			isHidden: true
		});

		if(isEnabled)
			ranwallAutoLauncher.enable();
		else
			ranwallAutoLauncher.disable(); 
	}

	static adjustWindow(){
		if(document.querySelector(".main")){

			let height = document.querySelector(".main").clientHeight;
			let width = document.querySelector("body").clientWidth;

			MAIN_WINDOW.setSize(width, height, true);
		}
	}

	static registerMagicShortcut(){
		globalShortcut.unregisterAll();

		let keys = store.getState().config.magicShortcutKeys;

		const ret = globalShortcut.register(keys, () => {
			WallpaperManager.new(true, true);
		})

		if (!ret)
			console.error('registration failed')
	}
}