import { app, shell, Menu } from 'electron';
import defaultMenu from 'electron-default-menu';
import preferences from './preferences';
import { createMainWindow } from './window';

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

  // on macOS, there's already the About Electron Fiddle menu item
  // under the first submenu set by the electron-default-menu package
  if (process.platform !== 'darwin') {
    items.push(
      {
        type: 'separator',
      },
      {
        label: 'About Electron Fiddle',
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
  ];

  // macOS has these items in the "Fiddle" menu
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
// const template = [
//   { role: 'appMenu' },
//   {
//     label: 'File',
//     submenu: [
//         {
//           label: 'New Snippet',
//           click: async () => {
//             getOrCreateMainWindow()
//           }
//         },
//         {
//             label: 'Preferences...',
//             click: async () => {
//                 preferences.show()
//             }
//         },
//         { role: 'close' }
//     ]
//   },
//   { role: 'editMenu' },
//   { role: 'viewMenu' },
//   { role: 'windowMenu' },
//   {
//     label: 'Help',
//     submenu: [
//       {
//         label: 'Learn More',
//         click: async () => {
//           const { shell } = require('electron')
//           await shell.openExternal('https://xinminlabs.github.io/synvert/')
//         }
//       }
//     ]
//   }
// ]
