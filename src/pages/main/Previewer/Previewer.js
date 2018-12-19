import React from 'react';
import { connect } from 'react-redux';
import { setWallpaperError } from '../../../actions/application';

import PullToRefresh from '../../../utils/PullToRefresh';
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
	constructor(props) {
		super(props);

		this.pullContainer = React.createRef();
		this.pullElement = React.createRef();
	}

	componentDidMount() {

	    let puller = new PullToRefresh(this.pullContainer.current, this.pullElement.current, this.allowPullToRefresh);

	    puller.onStartPull.subscribe(res => {
	    	// 
	    });

	    puller.onEndPull.subscribe(res => {
	    	WallpaperManager.new();
	    });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.hasError !== nextProps.hasError || this.props.wallpaperName !== nextProps.wallpaperName || this.props.isLoading !== nextProps.isLoading;
	}
	
	allowPullToRefresh = () => {
		return !this.props.isLoading;
	}

	getWallpaperOutput() {
		return (this.props.wallpaperName) ? WallpaperManager.getWallpaperSrcPath(this.props.wallpaperName) : null;
	}

	onLoadWallpaper = () => {		
		if(this.props.wallpaperName && !this.props.isLoading){
			
			setTimeout(() => {
				WindowManager.adjustWindow();
			}, 120);
		}
	}

	setCurrentWallpaper = () => {

		if(this.props.wallpaperName && !this.props.isLoading)
			WallpaperManager.set().subscribe();
	}

	render = () => {
		return Template(this.pullContainer, this.pullElement, this.props.isLoading, this.getWallpaperOutput(), this.setCurrentWallpaper, this.onLoadWallpaper, this.props.hasError);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Previewer);