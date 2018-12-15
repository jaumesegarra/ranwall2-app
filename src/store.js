import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers/index';

const saveToLocalstorageMiddleware = store => next => action => {
	next(action);
  	
  	if(action.type === 'SET_PROPERTIES'){
	  	let config = store.getState().config;
	
 		localStorage.setItem("config", JSON.stringify(config));
  	}
}

const store = createStore(
    reducers,
    applyMiddleware(saveToLocalstorageMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;