export const setWallpaper = (data) => (
	{
		type: 'SET_WALLPAPER',
		payload: data
	}
)

export const markAsCurrentWallpaper = () => (
    {
		type: 'MARK_AS_CURRENT_WALLPAPER'
	}
)