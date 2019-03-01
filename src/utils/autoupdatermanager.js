import Native from './native';

const { app, dialog, shell } = window.require("electron").remote;
const { autoUpdater } = window.require("electron").remote.require("electron-updater");

let checker;
export default class AutoUpdaterManager {
	constructor(){
		autoUpdater.channel = "latest";

		autoUpdater.allowPrerelease = false;

		this.init();
	}

	init(){
		if (Native.isDev()) {
		    const message = 'update-electron-app config looks good; aborting updates since app is in development mode'
		    console.info(message);
		    
		    return;
		}

		autoUpdater.checkForUpdates();

		autoUpdater.on('update-available', (info) => {
			checker = null;
			
			let notification = Native.showNotification(`New version: ${info.releaseName}`, 'Downloading now... Click here for more details.', () => {
				notification.close();

				shell.openExternal(`https://github.com/jaumesegarra/ranwall2-app/releases/tag/v${info.releaseName}`);
			}, null, false);
		});

		autoUpdater.on('update-downloaded', (info) => {

			let notification = Native.showNotification(`Update ${info.releaseName} ready for install.`, 'Click for restart the app now and apply this update.', () => {
				notification.close();

				autoUpdater.quitAndInstall(true);
			}, null, false);
		});

		autoUpdater.on('error', message => {
		  console.error('There was a problem updating the application');
		  console.error(message);
		});

	}

	static checkAgain() {
		if (Native.isDev())
			return dialog.showMessageBox({message: 'Dev version Bro.', detail: 'No updates available for dev', type: 'warning'});

		if(!checker){
			autoUpdater.checkForUpdates();
			
			checker = autoUpdater.once('update-not-available', () => {
				checker = null;
				dialog.showMessageBox({message: 'No updates available!', detail: `This is the latest version (${app.getVersion()})`});
			});
		}
	}
}