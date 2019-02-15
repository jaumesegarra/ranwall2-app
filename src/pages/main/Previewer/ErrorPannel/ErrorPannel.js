import React from 'react';
import { connect } from 'react-redux';

import WallpaperManager from '../../../../utils/wallpapermanager';

import './ErrorPannel.scss';
import Template from './ErrorPannel.jsx';

const mapStateToProps = state => {
	return {
		isLoading: state.application.isWallpaperLoading,
		hasError: state.application.hasWallpaperError
	}
}

const RETRY_TIME = 10;

class ErrorPannel extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			time: RETRY_TIME
		};
		this.interval = setInterval(() => this.subSecondToTime(), 1000);
	}

	shouldComponentUpdate(nextProps, nextState) {

		return (
		    this.props.isLoading !== nextProps.isLoading || 
		    this.props.hasError !== nextProps.hasError ||
		    this.state.time !== nextState.time
		)
	}

	subSecondToTime(){
		let currentTime = this.state.time;

		if(currentTime > 0 && this.props.hasError){
			this.setState({ time: currentTime-1 });

			if(currentTime === 1)
				WallpaperManager.new().subscribe();

		}else {
			this.setState({ time: RETRY_TIME });
			clearInterval(this.interval);
		}	
	}

	render = () => {
		return Template(this.state.time, this.props.isLoading);
	}
}

export default connect(mapStateToProps)(ErrorPannel);