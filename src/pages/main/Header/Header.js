import React from 'react';
import './Header.scss';
import Template from './Header.jsx';

import ConfigManager from '../../../utils/configmanager';

export default class Header extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
	
	openConfig(){
		ConfigManager.openWindow();
	}

	render = () => Template(this.openConfig);
}