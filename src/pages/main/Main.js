import React from 'react';
import { connect } from 'react-redux';

import Native, { MACOS } from '../../utils/native';
import MenuBar from '../../utils/menubar';
import TrayMenu from '../../utils/traymenu';
import WindowManager from '../../utils/windowmanager';
import ConfigManager from '../../utils/configmanager';

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

    if(Native.getSystem() === MACOS){
      MenuBar.create();
      WindowManager.autoChangeTheme();
    }

    TrayMenu.create();
    WindowManager.overlayMinimizeEvent();
    ConfigManager.localToState();
    ConfigManager.watcher();

    this.changeTheme(props.config.darkTheme);
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
            <div className="main">
            <Header />
            <Previewer />
            </div>
          );
  }
}

export default connect(mapStateToProps)(MainPage);