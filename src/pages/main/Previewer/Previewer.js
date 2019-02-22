import { useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import PullToRefresh from '../../../utils/PullToRefresh';
import WallpaperManager from '../../../utils/wallpapermanager';
import WindowManager from '../../../utils/windowmanager';

import './Previewer.scss';
import Template from './Previewer.jsx';

const mapStateToProps = state => {
	return {
		isLoading: state.application.isWallpaperLoading,
		hasError: state.application.hasWallpaperError,
		isPreviewerActive: state.application.isPreviewerActive,
		wallpaperName: state.wallpaper.name
	}
}

const Previewer = ({ isLoading, hasError, isPreviewerActive, wallpaperName }) => {
	const pullContainer = useRef(null);
	const pullElement = useRef(null);

	useEffect(() => {

		let puller = new PullToRefresh(pullContainer.current, pullElement.current, allowPullToRefresh);

		puller.onStartPull.subscribe(res => {
			// 
		});

		puller.onEndPull.subscribe(res => {
			WallpaperManager.new().subscribe();
		});

	}, []);
	
	const allowPullToRefresh = () => {
		return !isLoading;
	}

	const getWallpaperOutput = () => {
		return (wallpaperName) ? WallpaperManager.getWallpaperSrcPath(wallpaperName) : null;
	}

	const onLoadWallpaper = () => {		
		if(wallpaperName && !isLoading){
			
			setTimeout(() => {
				WindowManager.adjustWindow();
			}, 120);
		}
	}

	const setCurrentWallpaper = () => {

		if(wallpaperName && !isLoading)
			WallpaperManager.set().subscribe();
	}


	let loading = (isLoading || isLoading === null);
	return Template(pullContainer, pullElement, loading, getWallpaperOutput(), setCurrentWallpaper, onLoadWallpaper, hasError, isPreviewerActive);
};

export default connect(mapStateToProps)(Previewer);