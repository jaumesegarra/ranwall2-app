import { connect } from 'react-redux';

import WallpaperManager from '../../../../utils/wallpapermanager';

import './Actions.scss';
import Template from './Actions.jsx';

const mapStateToProps = state => {
	return {
		wallpaper: state.wallpaper,
		resolution: state.config.resolution,
		wallpaperPreview: state.config.wallpaperPreview
	}
}

const Actions = ({ wallpaper, resolution, wallpaperPreview }) => {

	const isDesiredSize = WallpaperManager.isDesiredResolution(wallpaper.originalResize, resolution);

	const setWallpaper = () => {
		WallpaperManager.set().subscribe();
	}

	const saveAs = () => {
		WallpaperManager.saveAs();
	}

	const previewUp = () => {
		if(wallpaperPreview)
			WallpaperManager.previewUp();
	}  

	const previewDown = () => {
		WallpaperManager.previewDown().subscribe();
	}

	return Template(wallpaper, isDesiredSize, setWallpaper, saveAs, previewUp, previewDown);
}

export default connect(mapStateToProps)(Actions);