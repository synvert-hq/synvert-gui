import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { getOrCreateMainWindow } from './window';
import { setupAboutPanel } from './about-panel';
import { setupMenu } from './menu';
import { setupUpdates } from './update';
import { EVENT_SYNC_SNIPPETS } from '../renderer/constants';

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "openFile"]
  });
  if (canceled) {
    return
  } else {
    return filePaths[0];
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen);
  getOrCreateMainWindow();
  setupAboutPanel();
  setupMenu();
  setupUpdates();
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      getOrCreateMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on(EVENT_SYNC_SNIPPETS, () => {
  getOrCreateMainWindow().webContents.send(EVENT_SYNC_SNIPPETS);
})
