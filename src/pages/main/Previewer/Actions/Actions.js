import React from 'react';
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

class Actions extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return (
		    this.props.wallpaper !== nextProps.wallpaper || 
		    this.props.wallpaper.wasSetAsWallpaper !== nextProps.wallpaper.wasSetAsWallpaper || 
		    this.props.resolution !== nextProps.resolution ||
		    this.props.wallpaperPreview !== nextProps.wallpaperPreview 
		);
	}

	isDesiredSize = WallpaperManager.isDesiredResolution(this.props.wallpaper.originalResize, this.props.resolution);

	setWallpaper = () => {
		WallpaperManager.set().subscribe();
	}

	saveAs = () => {
		WallpaperManager.saveAs();
	}

	previewUp = () => {
		if(this.props.wallpaperPreview)
			WallpaperManager.previewUp();
	}  

	previewDown = () => {
		WallpaperManager.previewDown();
	}

	render = () => {
		return Template(this.props.wallpaper, this.isDesiredSize, this.setWallpaper, this.saveAs, this.previewUp, this.previewDown);
	}
}

export default connect(mapStateToProps)(Actions);