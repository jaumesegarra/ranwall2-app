import * as Hammer from 'hammerjs';
import { Subject } from 'rxjs';

const RESISTANCE = 2.5;
const DISTANCE_TO_REFRESH = 40;

export default class PullToRefresh {

	constructor(container, element, isAllowed) {

		this.container = container;
		this.element = element;
		this.isAllowed = isAllowed;

		this.onStartPull = new Subject();
		this.onEndPull = new Subject();

		this.init();
	}

	init(){
		this.pan = {
		 	enabled: false,
		 	distance: 0,
		 	startingPositionY: 0
		};

		let h = new Hammer(this.container);

		h.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
		h.on('panstart', this.panStart);
	 	h.on('pandown', this.panDown);
	 	h.on('panup', this.panUp);
	 	h.on('panend', this.panEnd);
	}

	panStart = (event) => {
		if(this.isAllowed()){
			this.onStartPull.next();

			this.pan.startingPositionY = document.body.scrollTop;

		 	if (this.pan.startingPositionY === 0 )
		 		this.pan.enabled = true;
	 	}
	}

	panDown = (event) => {
		if (!this.pan.enabled)
	 		return;

	 	event.preventDefault();
	 	this.pan.distance = event.distance / RESISTANCE;

	 	this.setContentPan();
	 	this.setBodyClass();
	}

	/**
	 * Set the CSS transform on the content element to move it on the screen.
	 */
	setContentPan = () => {
		// Use transforms to smoothly animate elements on desktop and mobile devices
		this.container.style.transform = this.container.style.webkitTransform = 'translate3d( 0, ' + this.pan.distance + 'px, 0 )';
		this.element.style.opacity = .3;
	}

	/**
	 * Set/remove the loading body class to show or hide the loading indicator after pull down.
	 */
	setBodyClass = () => {		
	 	if (this.pan.distance > DISTANCE_TO_REFRESH)
	 		document.body.classList.add('ptr-refresh');
	 	else
	 		document.body.classList.remove('ptr-refresh');
	}

	panUp = (event) => {
		if (!this.pan.enabled || this.pan.distance === 0)
	 		return;

	 	event.preventDefault();

	 	this.pan.distance = (this.pan.distance < event.distance / RESISTANCE) ? 0 : event.distance / RESISTANCE;

	 	this.setContentPan();
	 	this.setBodyClass();
	}

	panEnd = (event) => {
		if (!this.pan.enabled)
	 		return;

	 	event.preventDefault();

	 	this.container.style.transform = this.container.style.webkitTransform = '';
	 	this.element.style.opacity = '1';

	 	if (document.body.classList.contains('ptr-refresh'))
	 		this.doLoading();
	 	else
	 		this.doReset();

	 	this.pan.distance = 0;
	 	this.pan.enabled = false;
	}

	/**
	 * Position content and refresh elements to show that loading is taking place.
	 */
	doLoading = () => {
	 	document.body.classList.add('ptr-loading');

		// The loading function should return a promise
		//
		
		this.onEndPull.next();

		// For UX continuity, make sure we show loading for at least one second before resetting
		setTimeout( function() {
			// Once actual loading is complete, reset pull to refresh
			this.doReset();
		}.bind(this), 1000);
	};

	/**
	 * Reset all elements to their starting positions before any paning took place.
	 */
	 doReset = () => {
	 	document.body.classList.remove('ptr-loading');
	 	document.body.classList.remove('ptr-refresh');
	 	document.body.classList.add('ptr-reset');

	 	var bodyClassRemove = function() {
	 		document.body.classList.remove('ptr-reset');
	 		document.body.removeEventListener('transitionend', bodyClassRemove, false);
	 	};

	 	document.body.addEventListener('transitionend', bodyClassRemove, false );
	 };
}