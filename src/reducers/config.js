import Native, { MACOS } from '../utils/native';
import PROVIDERS from '../constants/providers';

let defaultState = {
	launchAtStartup: false,
	hideAtLaunch: false,
	darkTheme: true,
	autoDetectTheme: (Native.getSystem() === MACOS), // for macos
	providers: PROVIDERS.map(p => p.code),
	resolution: Native.getScreenResolution(),
	wallpaperPreview: false,
	forceWallpaperResize: true,
	magicShortcutKeys: `${(Native.getSystem() === MACOS) ? 'Command' : 'Win'}+Shift+W`,
	defineCustomProviders: false
}

let localData = localStorage.getItem("config");
if(localData) defaultState = JSON.parse(localData);

export default (state = defaultState, action) => {
	switch(action.type){
		case 'LOAD_CONFIG':
		return {...action.payload.data};
		case 'SET_PROPERTIES':
		return {...state, ...action.payload.values};
		case 'RESET':
		return state;
		default: return state
	}
}