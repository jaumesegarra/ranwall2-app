import React from 'react';

import MainPage from './pages/main/Main';
import ConfigPage from './pages/config/Config';

import './App.css';

document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);

const App = () => {
  
  switch (window.location.hash.replace('#', '')) {
    case "config":
      return (<ConfigPage />);
    default:
      return (<MainPage />);
  }
};

export default App;