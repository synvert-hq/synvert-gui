const { BrowserWindow, shell } = require('electron');
const isDev = require('electron-is-dev')

let browserWindows = []

const getMainWindowOptions = () => {
  return {
    width: 1200,
    height: 900,
    minHeight: 600,
    minWidth: 600,
    acceptFirstMouse: true,
    backgroundColor: '#1d2427',
    webPreferences: {
      contextIsolation: false,
      devTools: isDev,
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: false
    },
  };
}

export const createMainWindow = () => {
  // Create the browser window.
  let browserWindow = new BrowserWindow(getMainWindowOptions());

  // and load the index.html of the app.
  browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  browserWindow.webContents.openDevTools();

  browserWindow.webContents.once('dom-ready', () => {
    if (browserWindow) {
      browserWindow.show();
    }
  });

  browserWindow.on('closed', () => {
    browserWindows = browserWindows.filter((bw) => browserWindow !== bw);

    browserWindow = null;
  });

  browserWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  browserWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  browserWindows.push(browserWindow);

  return browserWindow;
};

export function getOrCreateMainWindow() {
  return (
    BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
  );
}