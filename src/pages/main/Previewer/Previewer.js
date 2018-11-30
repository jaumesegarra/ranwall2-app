import React from 'react';
import './Previewer.scss';
import Template from './Previewer.jsx';

export default class Previewer extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			wallpaper: {
				state: -1
			}
		};

		this.hasError = false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
	
	render = () => Template(this.state.wallpaper, this.hasError);
}