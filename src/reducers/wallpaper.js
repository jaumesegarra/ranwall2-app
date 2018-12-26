import {createWallpaperObject} from '../utils/wallpapermanager';

let defaultState = createWallpaperObject();

export default (state = defaultState, action) => {
	switch(action.type){
		case 'SET_WALLPAPER':
			return {...state, name: action.payload.name, provider: action.payload.provider, originalResize: {width: action.payload.originalResize.width, height: action.payload.originalResize.height}, wasSetAsWallpaper: false};
		case 'MARK_AS_CURRENT_WALLPAPER':
			return {...state, wasSetAsWallpaper: true};
		default: return state
	}
}