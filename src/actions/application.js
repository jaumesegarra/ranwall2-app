export const setWallpaperLoader = (isLoading) => (
	{
		type: 'SET_WALLPAPER_LOADER',
		payload: {
			isLoading: isLoading
		}
	}
)

export const setWallpaperError = (hasError) => (
	{
		type: 'SET_WALLPAPER_ERROR',
		payload: {
			hasError: hasError
		}
	}
)