const path = require('path');

export const MACOS = 0;
export const WIN32 = 1;
export const WIN64 = 2;

export default class Native {
	static isDev(){
		return (window.__dirname.indexOf("node_modules") !== -1);
	}

	static getResource(name){
		let fpath = window.__dirname;

		if(Native.isDev())
			fpath = path.join(fpath.slice(0, fpath.indexOf("node_modules")), 'public');
		
		return path.join(fpath, name);
	}

	static getSystem(){
		let os = window.process.platform;
		let arch = window.process.arch;

		return (os === "darwin") ? MACOS : ((os === "win32" && arch === "x64") ? WIN64 : WIN32)
	}
}