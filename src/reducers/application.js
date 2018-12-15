let defaultState = {
	isWallpaperLoading: false,
	hasWallpaperError: false
}

export default (state = defaultState, action) => {
	switch(action.type){
		case 'SET_WALLPAPER_LOADER':
			return {...state, isWallpaperLoading: action.payload.isLoading};
		case 'SET_WALLPAPER_ERROR':
			return {...state, hasWallpaperError: action.payload.hasError};
		default: return state
	}
}