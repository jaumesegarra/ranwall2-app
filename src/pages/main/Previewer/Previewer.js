import React from 'react';
import { connect } from 'react-redux';
import { setWallpaperError } from '../../../actions/application';

import WallpaperManager from '../../../utils/wallpapermanager';
import WindowManager from '../../../utils/windowmanager';

import './Previewer.scss';
import Template from './Previewer.jsx';

const mapStateToProps = state => {
	return {
		isLoading: state.application.isWallpaperLoading,
		hasError: state.application.hasWallpaperError,
		wallpaperName: state.wallpaper.name
	}
}

const mapDispatchToProps = dispatch => ({
	setError: (hasError) => dispatch(setWallpaperError(hasError))
})

class Previewer extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.hasError !== nextProps.hasError || this.props.wallpaperName !== nextProps.wallpaperName || this.props.isLoading !== nextProps.isLoading;
	}
	
	getWallpaperOutput() {
		return (this.props.wallpaperName) ? WallpaperManager.getWallpaperSrcPath(this.props.wallpaperName) : null;
	}

	onLoadWallpaper() {		

		if(this.props.wallpaperName && !this.props.isLoading){
			
			setTimeout(() => {
				WindowManager.adjustWindow();
			}, 120);
		}
	}

	render = () => Template(this.props.isLoading, this.getWallpaperOutput(), this.onLoadWallpaper(), this.props.hasError);
}

export default connect(mapStateToProps, mapDispatchToProps)(Previewer);