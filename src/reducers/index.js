import { combineReducers } from 'redux';

import application from './application';
import wallpaper from './wallpaper';
import config from './config';

export default combineReducers({
	application,
	wallpaper,
	config
});