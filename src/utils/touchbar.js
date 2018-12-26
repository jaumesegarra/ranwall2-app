import WallpaperManager from './wallpapermanager';

const { TouchBar } = window.require('electron').remote;

const { TouchBarButton, TouchBarSpacer } = TouchBar;

const TOUCHBAR_OPTIONS = [
	new TouchBarButton({
		label: '🍭 DOWNLOAD AND SET!',
		click: () => WallpaperManager.new(true, true)
	}),
	new TouchBarSpacer({ size: 'flexible' }),
	new TouchBarButton({
		label: 'SAVE AS',
		backgroundColor: '#fff',
		click: WallpaperManager.saveAs
	}),
	new TouchBarButton({
		label: 'SET',
		backgroundColor: '#3e94f1',
		click: WallpaperManager.set
	}),
];

export default class TouchBarManager {
	
	static create(){
		MAIN_WINDOW.setTouchBar(TOUCHBAR_OPTIONS);
	}
}