const { Menu } = require('electron');
const preferences = require('./preferences');

const template = [
  {
    role: 'appMenu'
  },
  {
    label: 'File',
    submenu: [
        {
            label: 'Preferences...',
            click: async () => {
                preferences.show()
            }
        },
        {
            role: 'close'
        }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'windowMenu'
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://xinminlabs.github.io/synvert/')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)

module.exports = menu