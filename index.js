const { app, BrowserWindow } = require("electron");

function createWindow() {
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  window.loadFile("index.html");
}

app.whenReady().then(createWindow);
