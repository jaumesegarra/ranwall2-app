const { app, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

app.setAppUserModelId("jaumesegarra.ranwall");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 710,
    height: 425,
    resizable: false,
    fullscreen: false,
    transparent: true,
    title: "ranwall",
    icon: "./icon.ico",
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../public/index.html")}`
  );

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function() {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
