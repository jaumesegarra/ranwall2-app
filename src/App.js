import React from 'react';

import MainPage from './pages/main/Main';
import ConfigPage from './pages/config/Config';

import './App.css';

export default class App extends React.PureComponent {

  render() {
      switch (window.location.hash.replace('#', '')) {
        case "config":
        return (<ConfigPage />);
        default:
        return (<MainPage />);
      }
  }
}
