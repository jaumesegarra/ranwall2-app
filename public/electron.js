const {app, protocol, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({
  	width: 710, 
  	height: 410,
  	resizable: false,
  	fullscreen: false,
  	transparent: true,
  	title: "ranwall",
  	icon: "./icon.ico",
  	titleBarStyle: "hiddenInset",
  	show:true
  })

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  if(isDev)
    mainWindow.openDevTools();

  mainWindow.on('closed', function () {
    app.quit();
  })
}

app.on('ready', createWindow);

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
