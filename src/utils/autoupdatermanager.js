import Native from './native';

const { app, dialog } = window.require("electron").remote;
const { autoUpdater } = window.require("electron").remote.require("electron-updater");

let checker;
export default class AutoUpdaterManager {
	constructor(){
		this.init();
	}

	init(){
		if (Native.isDev()) {
		    const message = 'update-electron-app config looks good; aborting updates since app is in development mode'
		    console.info(message);
		    
		    return;
		}

		autoUpdater.checkForUpdates();

		autoUpdater.on('update-downloaded', (info) => {
			const dialogOpts = {
				type: 'info',
				buttons: ['Restart', 'Later'],
				title: 'Application Update',
				message: process.platform === 'win32' ? info.releaseNotes : info.releaseName,
				detail: 'A new version has been downloaded. Restart the application to apply the updates.'
			}

			dialog.showMessageBox(dialogOpts, (response) => {
				if (response === 0) autoUpdater.quitAndInstall(true)
			})
		});

		autoUpdater.on('error', message => {
		  console.error('There was a problem updating the application')
		  console.error(message)
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