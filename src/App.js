import React from 'react';
import { connect } from 'react-redux';

import './App.css';

import Header from './components/Header/Header';
import Previewer from './components/Previewer/Previewer';

const mapStateToProps = state => {
  return {
    config: state.config
  }
}

class App extends React.Component {
  constructor(props){
    super(props);

    this.changeTheme(props.config.lightTheme);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.config.lightTheme !== this.props.config.lightTheme;
  }

  changeTheme(isLight){
    if(isLight)
      document.body.classList.add('light');
    else
      document.body.classList.remove('light');
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.config.lightTheme !== this.props.config.lightTheme)
      this.changeTheme(this.props.config.lightTheme)
  }

  render() {
    return (
            <div className="app">
            <Header />
            <Previewer />
            </div>
    );
  }
}

export default connect(mapStateToProps)(App);
