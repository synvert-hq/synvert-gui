import { app } from 'electron';

/**
 * Sets Fiddle's About panel options on Linux and macOS
 *
 * @returns
 */
export const setupAboutPanel = () => {
  app.setAboutPanelOptions({
    applicationName: 'Synvert GUI',
    applicationVersion: app.getVersion(),
    authors: [{ name: 'Richrd Huang' }],
    copyright: '© Xinmin Labs',
    version: process.versions.electron,
    website: 'https://synvert.net',
  });
}
