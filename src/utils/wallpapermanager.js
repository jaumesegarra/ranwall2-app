import Native, { DEV_APP_FOLDER_NAME } from './native';
import Wallsh from './wallsh';
import WindowManager from './windowmanager';

import { Observable, isObservable, concat, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import PROVIDERS from '../constants/providers';
import store from '../store';
import { setWallpaperLoader, setWallpaperError } from '../actions/application';
import { setWallpaper, markAsCurrentWallpaper } from '../actions/wallpaper';

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

	function loadUrl(url, obs){
		let request = window.require('request');

		request({url: url, encoding: null}, (err, res, body) => {
			if(err)
				return obs.error(err);

			switch (provider.get.type) {
				case "json":
				let data = JSON.parse(body);

				request({url: provider.get.imgPath(data.response), encoding: null}, (err, res, body) => {
					if(err)
						return obs.error(err);

					tmpBinImage = body;
					obs.next(body);
					obs.complete();
				})
				break;
				default:
				tmpBinImage = body;
				obs.next(body);
				obs.complete();
			}
		});
	}

	return Observable.create(obs => {

		let url = provider.url(size); 
		if(isObservable(url)){
			url.subscribe(res => {
				loadUrl(res, obs);
			}, err => obs.error('Error obtain wallpaper url...'));
		}else loadUrl(url, obs);
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

function setWallpaperToDesktop(name, noSave = false){
	return Observable.create(obs => {
		Wallsh.set(WallpaperManager.getWallpaperOutput(name)).then(() => {
          obs.next(true);
          obs.complete();

          if(!noSave)
            localStorage.setItem('currentWallpaper', name);
          
        }, e => obs.error(e));
	})
}

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

	static getRandomProvider(){
		const providers = store.getState().config.providers;
		const providerCode = providers[Math.floor(Math.random() * providers.length)];

		return PROVIDERS.find(p => p.code === providerCode);
	}

	static new(autoSet, notification){
		let isLoading = store.getState().application.isWallpaperLoading;
		let loadingNotification;

		if(!isLoading){
			if(notification)
				loadingNotification = WindowManager.showNotification('Wait a second!', 'Downloading new wallpaper...', null, null, false);

			let wallpaper = createWallpaperObject();
			let config = store.getState().config;

			store.dispatch(setWallpaperLoader(true));

			wallpaper.name = WallpaperManager.getRandomName();
			wallpaper.provider = WallpaperManager.getRandomProvider();

			let observables = concat(	
			                         Native.clearAppFolder(), 
			                         downloadWallpaper(wallpaper.provider, config.resolution, wallpaper.name),
			                         resizeWallpaper(wallpaper, config.resolution, config.forceWallpaperResize),
			                         (autoSet ? setWallpaperToDesktop(wallpaper.name) : of(true))
			                         );

			observables.subscribe(res => {}, err => {
				console.error(err);
				store.dispatch(setWallpaperError(true));
				store.dispatch(setWallpaperLoader(false));
			}, comp => {
				console.log('DONE!');

				if(loadingNotification)
					loadingNotification.close();

				if(autoSet)
					wallpaper.wasSetAsWallpaper = true;

				store.dispatch(setWallpaperError(false));
				store.dispatch(setWallpaperLoader(false));
				store.dispatch(setWallpaper(wallpaper));
			});
		}
	}

	static set(noSave){
		let wallpaperName = store.getState().wallpaper.name;

		return setWallpaperToDesktop(wallpaperName, noSave).pipe(tap(res => {
			store.dispatch(markAsCurrentWallpaper());
		}));
	}

	static saveas(){

	}
}