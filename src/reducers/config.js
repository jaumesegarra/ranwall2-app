import Native, { MACOS } from '../utils/native';

let defaultState = {
	launchAtStartup: false,
	hideAtLaunch: true,
	darkTheme: true,
	autoDetectTheme: (Native.getSystem() === MACOS) // for macos
}

let localData = localStorage.getItem("config");
if(localData) defaultState = JSON.parse(localData);

export default (state = defaultState, action) => {
	switch(action.type){
		case 'LOAD_CONFIG':
			return {...action.payload.data};
		case 'SET_PROPERTY':
			return {...state, [action.payload.name]: action.payload.value};
		case 'RESET':
			return state;
		default: return state
	}
}