import React from 'react';

import Native, { MACOS } from '../../utils/native';
import WindowManager from '../../utils/windowmanager';

import './Config.scss';

import Nav from './Nav/Nav';
import Options from './Options/Options';

document.title = "ranwall: Configuration";

if(Native.getSystem() === MACOS)
    WindowManager.autoChangeTheme();

const ConfigPage = (props) => {

  return (
        <div className="config">
            <Nav />
            <Options />
        </div>
  );
};

export default ConfigPage;