let defaultState = {
	isWallpaperLoading: null,
	hasWallpaperError: false,
	isPreviewerActive: false
}

export default (state = defaultState, action) => {
	switch(action.type){
		case 'SET_WALLPAPER_LOADER':
			return {...state, isWallpaperLoading: action.payload.isLoading};
		case 'SET_WALLPAPER_ERROR':
			return {...state, hasWallpaperError: action.payload.hasError};
		case 'SET_PREVIEWER_ACTIVE':
			return {...state, isPreviewerActive: action.payload.isActive};
		default: return state
	}
}