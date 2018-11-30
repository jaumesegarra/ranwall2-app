import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import MainPage from './pages/main/Main';
import ConfigPage from './pages/config/Config';

import './App.css';

export default class App extends React.PureComponent {
  render() {
    return (
            <Router>
              <div>
                <Route path="/" exact component={MainPage} />
                <Route path="/config" component={ConfigPage} />
              </div>
            </Router>
    );
  }
}
