import { app } from 'electron'
import path from 'path'
import ElectronPreferences from 'electron-preferences'

import { showDevTools } from './utils'

const preferences = new ElectronPreferences({
    dataStore: path.join(app.getPath('userData'), 'preferences.json'),
    webPreferences: {
        devTools: showDevTools()
    },
    browserWindowOverrides: {
        title: 'Synvert GUI Preferences',
    },
    defaults: {
        ruby: {
            number_of_workers: 4,
        },
        settings: {
            show_diffs: 'ask_me',
        }
    },
    sections: [
        {
            id: 'ruby',
            label: 'Ruby',
            form: {
                groups: [
                    {
                        label: 'Ruby',
                        fields: [
                            {
                                label: 'Number of workers to run in parallel',
                                key: 'number_of_workers',
                                type: 'number',
                            }
                        ]
                    },
                ]
            }
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings-gear-63',
            form: {
                groups: [
                    {
                        label: 'Settings',
                        fields: [
                            {
                                label: 'Show diffs after running a snippet',
                                key: 'show_diffs',
                                type: 'radio',
                                options: [
                                    { label: 'Always show', value: 'always_show' },
                                    { label: "Never show", value: 'never_show' },
                                    { label: 'Ask me every time', value: 'ask_me' }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
});

export default preferences
