import React from 'react';
import { connect } from 'react-redux';

import Native, { MACOS } from '../../utils/native';
import MenuBar from '../../utils/menubar';
import TrayMenu from '../../utils/traymenu';
import WindowManager from '../../utils/windowmanager';
import ConfigManager from '../../utils/configmanager';
import WallpaperManager from '../../utils/wallpapermanager';

import './Main.scss';

import Header from './Header/Header';
import Previewer from './Previewer/Previewer';

const mapStateToProps = state => {
  return {
    config: state.config
  }
}

class MainPage extends React.Component {
  constructor(props){
    super(props);

    WindowManager.checkIfLaunchAtStartup();
    WindowManager.registerMagicShortcut();
    
    if(Native.getSystem() === MACOS){
      MenuBar.create();
      WindowManager.autoChangeTheme();
    }

    TrayMenu.create();
    WindowManager.overlayMinimizeEvent();
    ConfigManager.watcher();

    this.changeTheme(props.config.darkTheme);

    if(this.props.config.hideAtLaunch)
      WindowManager.hide();
    else
      MAIN_WINDOW.show();

    WallpaperManager.new();
  }

  componentDidMount = () => {
    document.title = "ranwall";
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.config.darkTheme !== this.props.config.darkTheme;
  }

  changeTheme(isDark){
    if(isDark)
      document.body.classList.remove('light');
    else
      document.body.classList.add('light');
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.config.darkTheme !== this.props.config.darkTheme)
      this.changeTheme(this.props.config.darkTheme)
  }

  render() {
    return (
            <div className="border">
              <div className="main">
              <Header />
              <Previewer />
              </div>
            </div>
          );
  }
}

export default connect(mapStateToProps)(MainPage);