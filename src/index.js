import React from 'react';
import ReactDOM from 'react-dom';
import 'line-awesome/css/line-awesome.min.css';
import './index.scss';
import App from './App';

import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
    	<App />
    </Provider>, 
document.getElementById('root'));