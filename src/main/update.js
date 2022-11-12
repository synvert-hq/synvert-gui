import os from 'os'
import { app, autoUpdater, dialog } from 'electron'

const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64

const updaterFeedURL = 'https://download.synvert.net/update/'+platform+'/'+version;

export const setupUpdates = () => {
  const checkOS = process.platform === 'darwin' || process.platform === 'win32';
  if (!checkOS || process.env.DEBUG === 'true') {
    return;
  }

  autoUpdater.setFeedURL(updaterFeedURL);

  autoUpdater.on('checking-for-update', () => {
    console.log('The autoUpdater is checking for an update')
  });
  autoUpdater.on('update-available', () => {
    console.log('The autoUpdater has found an update and is now downloading it!')
  });
  autoUpdater.on('update-not-available', () => {
    console.log('The autoUpdater has not found any updates :(')
  });

  autoUpdater.on('error', (error) => {
    console.log('error', error); // ignore the error
  });

  // Ask the user if update is available
  autoUpdater.on('update-downloaded', (event, notes, name, date) => {
    console.log('The autoUpdater has downloaded an update!')
    console.log(`The new release is named ${name} and was released on ${date}`)
    console.log(`The release notes are: ${notes}`)

    // Ask user to update the app
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: name,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }).then(({ response }) => {
      if (response === 0) {
        app.removeAllListeners("window-all-closed");
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.checkForUpdates()
  setInterval(() => { autoUpdater.checkForUpdates() }, 3600 * 1000)
}
