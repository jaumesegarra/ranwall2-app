import { Observable } from 'rxjs';

const { Notification, shell, dialog } = window.require("electron").remote;
const path = window.require('path');
const fs = window.require('fs');

export const MACOS = 0;
export const WIN32 = 1;
export const WIN64 = 2;

export const APP_FOLDER_NAME = '.ranwall2';
export const DEV_APP_FOLDER_NAME = 'tmpAppFolder';
export const CUSTOM_PROVIDERS_FILENAME = 'customProviders.config.js';

function providerCodeIsOk(data){
	let result = true;

	if(
	   data.indexOf("window") !== -1 || 
	   data.indexOf("require") !== -1 || 
	   data.indexOf("document") !== -1 ||
	   data.indexOf("alert") !== -1 ||
	   data.indexOf("constructor") !== -1 ||
	   data.indexOf("eval") !== -1
	)
		result = false;

	return result;
}

export default class Native {
	static isDev(){
		return window.require("electron").remote.require("electron-is-dev");
	}

	static showNotification(title, text, onclick = null, onclose = null, autoclose = true){
		let data = { title: title, body: text };
		
		if(Native.getSystem() !== MACOS)
			data.icon = Native.getResource("./icon.ico");

		let notification = new Notification(data);

		notification.on('click',  () => {

			if(onclick && typeof onclick === 'function') onclick();

			if(!onclick || typeof onclick !== 'function'){
				notification.close();

				if(onclose && typeof onclose === 'function') onclose();
			}
		});

		notification.on('show', () => {
			if(autoclose)
				setTimeout(() => {
					notification.close(); 

					if(onclose && typeof onclose === 'function')
						onclose()
				}, 5000);
		});

		notification.show();

		return notification;
	}

	static getResource(name){
		let fpath = window.__dirname;

		if(Native.isDev())
			fpath = path.join(fpath.slice(0, fpath.indexOf("node_modules")), 'public');
		
		return path.join(fpath, name);
	}

	static getSystem(){
		let os = window.process.platform;
		let arch = window.process.arch;

		return (os === "darwin") ? MACOS : ((os === "win32" && arch === "x64") ? WIN64 : WIN32)
	}

	static getScreenResolution(){
		return [window.screen.width, window.screen.height];
	}

	static getAppPath(){
		let stPath = window.process.execPath;

		if (Native.getSystem() === MACOS) {
			stPath = stPath.split("/Contents/");
			stPath = stPath[0];
		}

		return stPath;
	}

	static getAppFolder(){
		let folder = null;

		if(Native.isDev())
			folder = Native.getResource(DEV_APP_FOLDER_NAME);
		else 
			folder = (window.process.env[(Native.getSystem() === WIN32 || Native.getSystem() === WIN64) ? 'USERPROFILE' : 'HOME'])+"/"+APP_FOLDER_NAME;
		
		return folder;
	}

	static obtainUserCustomProviders(runThen){
		fs.readFile(path.join(Native.getAppFolder(), CUSTOM_PROVIDERS_FILENAME), 'utf8', function (err, data) {
		  let codeFileIsGood = providerCodeIsOk(data);
	      if (err || !codeFileIsGood) {
	      	localStorage.removeItem("tmpUserCustomProviders");

	      	runThen();

	      	if(!codeFileIsGood){
	      		// Disable defineCustomProviders 
	      		setTimeout(() => dialog.showErrorBox("Bad code!", "Sequence not valid in the code of custom providers file."), 200);
	      	}

	      	return;
	      }
	      
	      localStorage.setItem("tmpUserCustomProviders", data);

	      runThen();
	    });
	}

	static openUserCustomProviders(){
		let filePath = path.join(Native.getAppFolder(), CUSTOM_PROVIDERS_FILENAME);

		if(fs.existsSync(filePath)){
			shell.openItem(filePath);
		}else{
			let readStream = fs.createReadStream(Native.getResource(CUSTOM_PROVIDERS_FILENAME));

			readStream.once('error', (err) => {
			    console.log(err);
			});

			readStream.once('end', Native.openUserCustomProviders);

			readStream.pipe(fs.createWriteStream(filePath));
		}
	}

	static checkAppFolder(){
		let folder = Native.getAppFolder();

		function finish(obs, hasError){
			if(!hasError)
				obs.error(hasError);
			else
				obs.next(true);

			obs.complete();
		}

		return Observable.create(obs => {
			if(fs.existsSync(folder)){
				Native.clearAppFolder().subscribe(res => finish(obs), err => finish(obs, 'Error clearing folder'));
			}else{
				window.require('mkdirp')(folder, function (err) {
					if (err) 
						finish(obs, 'Error creating folder');
					else
						finish(obs);
				});
			}
		});
	}

	static clearAppFolder(){
		let del = window.require('delete');
		let folder = Native.getAppFolder();

		return Observable.create(obs => {
			let currentWallpaper = localStorage.getItem("currentWallpaper");

			let arrDeletes = [`${folder}/*.jpg`];
			if(currentWallpaper) arrDeletes.push(`!${currentWallpaper}`);

			del(arrDeletes, {force: true}, function(err, deleted) {
				if (err)
					obs.error('Error removing a file:', err); 

				obs.next(deleted);
				obs.complete();
			});
		});
	}
}