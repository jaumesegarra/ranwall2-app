import React from 'react';
import './Header.scss';
import Template from './Header.jsx';

export default class Header extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
	
	render = Template;
}