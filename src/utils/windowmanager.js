import Native from './native.js';
import store from '../store';
import { setProperty } from '../actions/config';

const { app, systemPreferences } = window.require('electron').remote;

export default class WindowManager{
	
	static showNotification(title, text, onclick = null, onclose = null, autoclose = true){
		let notification = new Notification(title, {
			body: text,
			icon: Native.getResource("./icon.ico")
		});

		notification.onclick = () => {
			notification.close();

			if(!onclose) onclose();

			if(!onclick) onclick();
		}

		notification.onshow = () => {
			if(autoclose)
				setTimeout(() => {
					notification.close(); 

					if(onclose !== undefined)
						onclose()
				}, 2000);
		}

		return notification;
	}

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
		app.dock.show();
		MAIN_WINDOW.show();
	}

	static hide(showNotification = false){
		MAIN_WINDOW.setSkipTaskbar(true);
		app.dock.hide();
		MAIN_WINDOW.hide();

		if(showNotification && !WindowManager._hideNotification)
			WindowManager._hideNotification = WindowManager.showNotification("App is hide!", "This app is hide, click to show!", WindowManager.show, () => delete WindowManager._hideNotification, true);
		
	}

	static autoChangeTheme(){

		systemPreferences.subscribeNotification(
		  'AppleInterfaceThemeChangedNotification',
		  function theThemeHasChanged () {
		    store.dispatch(setProperty("lightTheme", !systemPreferences.isDarkMode()));
		  }
		)
	}
}