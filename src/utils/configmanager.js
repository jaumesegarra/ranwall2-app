import store from '../store';
import { loadConfig } from '../actions/config';

export default class ConfigManager {
	static localToState(){
		let data = localStorage.getItem("config");
		if(data){
			store.dispatch(loadConfig(JSON.parse(data)));
		}
	}

	static watcher(){
		window.addEventListener('storage', ConfigManager.localToState);
	}
}