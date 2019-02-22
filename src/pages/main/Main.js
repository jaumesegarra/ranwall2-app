import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Native, { MACOS } from '../../utils/native';
import MenuBar from '../../utils/menubar';
import TouchBar from '../../utils/touchbar';
import TrayMenu from '../../utils/traymenu';
import WindowManager from '../../utils/windowmanager';
import ConfigManager from '../../utils/configmanager';
import WallpaperManager from '../../utils/wallpapermanager';
import AutoUpdaterManager from '../../utils/autoupdatermanager';

import './Main.scss';

import Header from './Header/Header';
import Previewer from './Previewer/Previewer';

const mapStateToProps = state => {
  return {
    config: state.config
  }
}

const changeTheme = (isDark) => {
  if(isDark)
    document.body.classList.remove('light');
  else
    document.body.classList.add('light');
}

const loadAtStartup = (config) => {
  document.title = "ranwall";

  WindowManager.checkIfLaunchAtStartup();
  WindowManager.registerMagicShortcut();

  if(Native.getSystem() === MACOS){
    MenuBar.create();
    TouchBar.create();
    WindowManager.autoChangeTheme();
  }

  TrayMenu.create();
  WindowManager.overlayMinimizeEvent();
  ConfigManager.watcher();

  changeTheme(config.darkTheme);

  if(config.hideAtLaunch)
    WindowManager.hide();
  else
    MAIN_WINDOW.show();

  new AutoUpdaterManager();

  if(config.defineCustomProviders)
    Native.obtainUserCustomProviders(() => WallpaperManager.new().subscribe());
  else{
    localStorage.removeItem("tmpUserCustomProviders");
    WallpaperManager.new().subscribe();
  }
}

const MainPage = React.memo(({ config }) => {

  useEffect(() => {
    loadAtStartup(config);
  }, []);

  useEffect(() => {
    changeTheme(config.darkTheme);
  });

  return (
    <div className="border">
      <div className="main">
        <Header />
        <Previewer />
      </div>
    </div>
  );
}, (prevProps, nextProps) => nextProps.config.darkTheme === prevProps.config.darkTheme);

export default connect(mapStateToProps)(MainPage);