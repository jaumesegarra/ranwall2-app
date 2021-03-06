import React from 'react';
import './Nav.scss';

const Nav = (props) => {
	return (
	    <div className="nav">
	    	<a href="#app" className="button grey light">App</a>
	    	<a href="#theme" className="button grey light">Theme</a>
			<a href="#wallpaper" className="button grey light">Wallpaper</a>
			<a href="#tricks" className="button grey light">Tricks</a>
			<a href="#advanced" className="button grey light">Advanced</a>
	    </div>
	)
};

export default Nav;