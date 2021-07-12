import { app, ipcMain, shell, Menu } from 'electron';
import defaultMenu from 'electron-default-menu';

import preferences from './preferences';
import { createMainWindow } from './window';
import { EVENT_SYNC_SNIPPETS } from '../renderer/constants';

const isSubmenu = (submenu) => {
  return !!submenu && Array.isArray(submenu);
}

const getHelpItems = () => {
  const items = [];

  items.push(
    {
      type: 'separator',
    },
    {
      label: 'Learn More',
      click() {
        shell.openExternal('https://xinminlabs.github.io/synvert/')
      }
    },
  );

  // on macOS, there's already the About Synvert menu item
  // under the first submenu set by the electron-default-menu package
  if (process.platform !== 'darwin') {
    items.push(
      {
        type: 'separator',
      },
      {
        label: 'About Synvert',
        click() {
          app.showAboutPanel();
        },
      },
    );
  }

  return items;
}

const getPreferencesItems = () => {
  return [
    {
      type: 'separator',
    },
    {
      label: 'Preferences',
      accelerator: 'CmdOrCtrl+,',
      click() {
        preferences.show()
      },
    },
    {
      type: 'separator',
    },
  ];
}

const getQuitItems = () => {
  return [
    {
      type: 'separator',
    },
    {
      role: 'quit',
    },
  ];
}

const getFileMenu = () => {
  const fileMenu = [
    {
      label: 'New Window',
      click: () => createMainWindow(),
      accelerator: 'CmdOrCtrl+Shift+N',
    },
    {
      label: 'Sync Snippets',
      click: () => {
        ipcMain.emit(EVENT_SYNC_SNIPPETS)
      },
    },
  ];

  // macOS has these items in the "Synvert" menu
  if (process.platform !== 'darwin') {
    fileMenu.splice(
      fileMenu.length,
      0,
      ...getPreferencesItems(),
      ...getQuitItems(),
    );
  }

  return {
    label: 'File',
    submenu: fileMenu,
  };
}

export const setupMenu = () => {
  const menu = defaultMenu(app, shell);
  menu.map(item => {
    const { label } = item

    // Append the "Settings" item
    if (
      process.platform === 'darwin' &&
      label === app.name &&
      isSubmenu(item.submenu)
    ) {
      item.submenu.splice(2, 0, ...getPreferencesItems());
    }

    // Append items to "Help"
    if (label === 'Help' && isSubmenu(item.submenu)) {
      item.submenu = getHelpItems();
    }

    return item;
  });

  menu.splice(
    process.platform === 'darwin' ? 1 : 0,
    0,
    getFileMenu(),
  );

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}