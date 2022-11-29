import { app, shell, Menu } from 'electron';
import defaultMenu from 'electron-default-menu';

import preferences from './preferences';

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
        shell.openExternal('https://synvert.net')
      }
    },
    {
      label: 'Contact Us',
      click() {
        shell.openExternal('https://synvert.net/contact_us/')
      }
    }
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
  const fileMenu = [...getPreferencesItems(), ...getQuitItems()];

  return { label: 'File', submenu: fileMenu };
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

    if (process.platform === 'darwin' && label === 'Window' && isSubmenu(item.submenu)) {
      item.submenu.splice(1, 1);
    }

    // Append items to "Help"
    if (label === 'Help' && isSubmenu(item.submenu)) {
      item.submenu = getHelpItems();
    }

    return item;
  });

  if (process.platform !== "darwin") {
    menu.splice(0, 2);
    menu.splice(0, 0, getFileMenu());
  } else {
    menu.splice(1, 2);
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}
