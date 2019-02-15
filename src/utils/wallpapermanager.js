import Native, { DEV_APP_FOLDER_NAME } from './native';
import Wallsh from './wallsh';

import { Observable, isObservable, concat, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import PROVIDERS from '../constants/providers';
import store from '../store';
import { setWallpaperLoader, setWallpaperError, setPreviewerActive } from '../actions/application';
import { setWallpaper, markAsCurrentWallpaper } from '../actions/wallpaper';
import { setProperties } from '../actions/config';

const { dialog } = window.require('electron').remote;
const fs = window.require('fs');
const request = window.require('request');

export function createWallpaperObject () {
	return {
		name: null,
		provider: null,
		originalResize: {
			width: 0,
			height: 0
		},
		wasSetAsWallpaper: null
	}
}

let tmpBinImage = null;
function downloadWallpaper(provider, size, name){

	function getRequest(url, obs, auth = null){
		let params = {url: url, encoding: null};

		if(auth) params.auth = auth;

		request(params, (err, res, body) => {
			if(err)
				return obs.error(err);

			if(res.statusCode !== 200)
				return obs.error(res.statusCode);
			
			if((res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') >= 0) || (provider.get && provider.get.type === 'json')){
				let data = JSON.parse(body);

				if(!provider.get || !provider.get.imgPath)
					return obs.error('Not defined function to obtain the image path...');

				return getRequest(provider.get.imgPath(data), obs);
			}

			tmpBinImage = body;
			obs.next(body);
			obs.complete();
		});
	}

	return Observable.create(obs => {
		let auth = (provider.get && provider.get.auth) ? provider.get.auth : null;

		let url = provider.url(size); 
		if(isObservable(url)){
			url.subscribe(res => {
				getRequest(url, obs, auth);
			}, err => obs.error(err));
		}else getRequest(url, obs, auth);
	});
}

function resizeWallpaper(wallpaper, resolution, forceResize){

	return Observable.create(obs => {
		let Jimp = window.require('jimp');

		Jimp.read(tmpBinImage).then(image => {
			tmpBinImage = null;

			// Image resolution
			let width = image.bitmap.width;
			let height = image.bitmap.height;

	        wallpaper.originalResize = { width: width, height: height }; // save in wallpaper data

	        if(!WallpaperManager.isDesiredResolution(wallpaper.originalResize, resolution) && forceResize)
	        	image.cover(resolution[0], resolution[1]); // update resolution of the image

	        // save the image
	        image.quality(100);
	        image.write(WallpaperManager.getWallpaperOutput(wallpaper.name), () => {
	        	obs.next(true);
	          	obs.complete();
	        });
	     })
		.catch(err => {
			obs.error(err);
		});
	})
}

function setWallpaperToDesktop(path, noSave = false){
	return Observable.create(obs => {
		Wallsh.set(path).then(() => {
          obs.next(true);
          obs.complete();

          if(!noSave)
            localStorage.setItem('currentWallpaper', path);
          
        }, e => obs.error(e));
	})
}

function getCurrentDesktopWallpaper(){
	return Observable.create(obs => {
		Wallsh.get().then(res => {

			setTimeout(() => {
				obs.next(res);
				obs.complete();
			}, 620);

		}, e => obs.error(e))
	})
}

let tmpCurrentWallpaper = null;

let isSettingNewWallpaper = false;
let tmpPreviewUpObs = null;
let tmpPreviewDownObs = null;

export default class WallpaperManager{

	static getWallpaperOutput(wallpaperName){
		return window.require('path').join(Native.getAppFolder(), wallpaperName+'.jpg');
	}

	static getWallpaperSrcPath(wallpaperName){
		let output = null;

		if(Native.isDev())
			output = DEV_APP_FOLDER_NAME + '/'+wallpaperName+'.jpg';
		else	
			output = 'file:///'+WallpaperManager.getWallpaperOutput(wallpaperName);

		return output;
	}

	static isDesiredResolution(resolution, desired){
		return (resolution.width === desired[0] && resolution.height === desired[1])
	}

	static getRandomName(){
		return Math.random().toString(36).substring(4);
	}

	static getAllProviders(){
		let userProviders = [];
		let customProviders = localStorage.getItem("tmpUserCustomProviders");

		if(customProviders){
			/* eslint no-new-func: 0 */
			let obj = Function("'use strict'; "+customProviders)();

		    userProviders = obj.map(o => ({
		        ...o,
		    	byUser: true
		    }));
	  	};

		return [...PROVIDERS, ...userProviders];
	}

	static getRandomProvider(){
		const userProviders = store.getState().config.providers;
		const providerCode = userProviders[Math.floor(Math.random() * userProviders.length)];

		let p = WallpaperManager.getAllProviders().find(p => p.code === providerCode);

		if(!p){
			let newProviders = [...userProviders].filter(p => p !== providerCode);

			if(newProviders.length === 0)
				newProviders = PROVIDERS.map(p => p.code);

			store.dispatch(setProperties({ providers: newProviders}));

			return WallpaperManager.getRandomProvider();
		}

		return p;
	}

	static new(autoSet, notification){
		let isLoading = store.getState().application.isWallpaperLoading;
		let loadingNotification;

		if(isLoading)
			return of(false);

		return Observable.create(obs => {
			if(tmpPreviewUpObs) tmpPreviewUpObs.unsubscribe();
			if(tmpPreviewDownObs) tmpPreviewDownObs.unsubscribe();

			if(notification)
				loadingNotification = Native.showNotification('Wait a second!', 'Downloading new wallpaper...', null, null, false);

			let wallpaper = createWallpaperObject();
			let config = store.getState().config;

			store.dispatch(setWallpaperLoader(true));

			wallpaper.name = WallpaperManager.getRandomName();
			wallpaper.provider = WallpaperManager.getRandomProvider();

			let observables = concat(	
			    Native.clearAppFolder(), 
			    downloadWallpaper(wallpaper.provider, config.resolution, wallpaper.name),
			    resizeWallpaper(wallpaper, config.resolution, config.forceWallpaperResize),
			    (autoSet ? setWallpaperToDesktop(WallpaperManager.getWallpaperOutput(wallpaper.name)) : of(true))
			);

			return observables.subscribe(res => {}, err => {
				console.error(wallpaper.provider.name+': ', err);
				obs.error(wallpaper.provider.name+': ', err);

				store.dispatch(setWallpaperError(true));
				store.dispatch(setWallpaperLoader(false));
			}, comp => {

				if(loadingNotification)
					loadingNotification.close();

				if(autoSet)
					wallpaper.wasSetAsWallpaper = true;

				store.dispatch(setWallpaperError(false));
				store.dispatch(setWallpaperLoader(false));
				store.dispatch(setWallpaper(wallpaper));

				obs.next(true);
				obs.complete();
			});
		});
	}

	static set(noSave){
		let isLoading = store.getState().application.isWallpaperLoading;
		if(!isLoading){
			let wallpaperName = store.getState().wallpaper.name;

			if(!noSave){
				isSettingNewWallpaper = true;
				if(tmpPreviewUpObs) tmpPreviewUpObs.unsubscribe();
				if(tmpPreviewDownObs) tmpPreviewDownObs.unsubscribe();
			}

			return setWallpaperToDesktop(WallpaperManager.getWallpaperOutput(wallpaperName), noSave).pipe(tap(res => {
				if(!noSave){
					store.dispatch(setPreviewerActive(false));
					store.dispatch(markAsCurrentWallpaper());

					isSettingNewWallpaper = false;
				}
			}));
		}
	}

	static saveAsDialogIsActive = false;
	static saveAs(){

		let isLoading = store.getState().application.isWallpaperLoading;
		if(!isLoading && !WallpaperManager.saveAsDialogIsActive){
			let wallpaperName = store.getState().wallpaper.name;

			WallpaperManager.saveAsDialogIsActive = true;

			dialog.showSaveDialog(null, {
				title: 'Save wallpaper as',
				defaultPath: wallpaperName.toUpperCase(),
				filters: [{ name: 'Images', extensions: ['jpeg'] }]
			}, res => {
				WallpaperManager.saveAsDialogIsActive = false;

				if(res)
					fs.createReadStream(WallpaperManager.getWallpaperOutput(wallpaperName)).pipe(fs.createWriteStream(res));
			})
		}
	}

	static previewUp(){
		if(!isSettingNewWallpaper){
			if(tmpPreviewDownObs) tmpPreviewDownObs.unsubscribe();

			tmpPreviewUpObs = getCurrentDesktopWallpaper().subscribe(res => {
				tmpCurrentWallpaper = res;

				tmpPreviewUpObs = WallpaperManager.set(true).subscribe(null, null, () => store.dispatch(setPreviewerActive(true)));

			}, err => console.error(err));
		}	
	}

	static previewDown(){
		if(!isSettingNewWallpaper){
			if(tmpPreviewUpObs) tmpPreviewUpObs.unsubscribe();

			if(tmpCurrentWallpaper)
				tmpPreviewDownObs = setWallpaperToDesktop(tmpCurrentWallpaper).subscribe(null, null, () => store.dispatch(setPreviewerActive(false)));
		}
	}
}