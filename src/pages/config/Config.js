import React from 'react';

import Native, { MACOS } from '../../utils/native';
import WindowManager from '../../utils/windowmanager';

import './Config.scss';

import Nav from './Nav/Nav';
import Options from './Options/Options';

export default class ConfigPage extends React.PureComponent {
  
  componentDidMount = () => {
    document.title = "ranwall: Configuration";

    if(Native.getSystem() === MACOS)
      WindowManager.autoChangeTheme();
  }

  render() {
    return (
          <div className="config">
              <Nav />
              <Options />
          </div>
    );
  }
}