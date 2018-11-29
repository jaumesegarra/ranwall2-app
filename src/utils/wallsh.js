import { Native, MACOS } from './native.js';

const path = window.require('path');
const childProcess = window.require('child_process');
const pify = window.require('pify');

const execFile = pify(childProcess.execFile);

let bin_name; let params;

if (Native.getSystem() === MACOS){
	bin_name = 'wallsh-macos';
	params = ['-g', '-s'];
} else {
	bin_name = 'wallsh-windows.exe';
	params = ['/G', '/S'];
}

const bin = Native.getResource('bin/'+bin_name);

export default class Wallsh{
	static get(){
		return execFile(bin, [params[0]]).then(x => x.trim());
	}

	static set(imagePath){
		if (typeof imagePath !== 'string') {
			return Promise.reject(new TypeError('Expected a string'));
		}

		return execFile(bin, [params[1], path.resolve(imagePath)]);
	}
}