import { useState, useEffect } from 'react';
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

const ErrorPannel = ({ isLoading, hasError }) => {
	const [ time, setTime ] = useState(RETRY_TIME);
	let timeUpdater = null;

	const subSecondToTime = () =>{
		let currentTime = time;

		if(currentTime > 0)
			setTime(currentTime-1);

		if(currentTime === 0){
			
			WallpaperManager.new().subscribe();

			setTime(RETRY_TIME);
		}
	}

	useEffect(() => {
		return () => clearTimeout(timeUpdater);
	}, []);

	useEffect(() => {
		if(!isLoading) 
			timeUpdater = setTimeout(subSecondToTime, 1000);
	});
	
	return Template(time, isLoading);

};

export default connect(mapStateToProps)(ErrorPannel);