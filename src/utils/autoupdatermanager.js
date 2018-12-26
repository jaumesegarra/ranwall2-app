import Native from './native';

const { app, autoUpdater, dialog } = window.require("electron").remote;

const os = window.require('os');
const {format} = require('util');
const pkg = require('../../package.json');
const userAgent = format(
  '%s/%s (%s: %s)',
  pkg.name,
  pkg.version,
  os.platform(),
  os.arch()
);
const requestHeaders = {'User-Agent': userAgent};
const prss = window.process;
const gitPath = 'jaumesegarra/ranwall2-app';
const feedURL = `https://update.electronjs.org/${gitPath}/${prss.platform}-${prss.arch}/${app.getVersion()}`;

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

		autoUpdater.setFeedURL(feedURL, requestHeaders)

		autoUpdater.checkForUpdates();

		autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
			const dialogOpts = {
				type: 'info',
				buttons: ['Restart', 'Later'],
				title: 'Application Update',
				message: process.platform === 'win32' ? releaseNotes : releaseName,
				detail: 'A new version has been downloaded. Restart the application to apply the updates.'
			}

			dialog.showMessageBox(dialogOpts, (response) => {
				if (response === 0) autoUpdater.quitAndInstall()
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
				dialog.showMessageBox({message: 'No updates available!', detail: `This is the latest version (${app.getVersion()})`});
			});
		}
	}
}