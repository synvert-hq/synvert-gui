const os = require('os');
const { app, autoUpdater, dialog } = require('electron');

const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64

const updaterFeedURL = 'https://download-synvert.xinminlabs.com/update/'+platform+'/'+version;

export const setupUpdates = () => {
  const checkOS = process.platform === 'darwin' || process.platform === 'win32';
  if (!checkOS || process.env.DEBUG === 'true') {
    return;
  }

  autoUpdater.setFeedURL(updaterFeedURL);
  /* Log whats happening
  TODO send autoUpdater events to renderer so that we could console log it in developer tools
  You could alsoe use nslog or other logging to see what's happening */
  autoUpdater.on('error', err => console.log(err));
  autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
  autoUpdater.on('update-available', () => console.log('update-available'));
  autoUpdater.on('update-not-available', () => console.log('update-not-available'));

  // Ask the user if update is available
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    // Ask user to update the app
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }).then(({ response }) => {
      if (response === 0) {
        app.removeAllListeners("window-all-closed");
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.checkForUpdates()
  setInterval(() => { autoUpdater.checkForUpdates() }, 600000)
}