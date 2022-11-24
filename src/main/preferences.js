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
            enabled: true,
            number_of_workers: 4,
        },
        javascript: {
            enabled: true
        },
        typescript: {
            enabled: true
        }
    },
    sections: [
        {
            id: 'ruby',
            label: 'Ruby',
            form: {
                groups: [
                    {
                        fields: [
                            {
                                label: 'Enable synvert ruby',
                                key: 'enabled',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: true }
                                ]
                            },
                            {
                                label: 'Number of workers to run in parallel',
                                key: 'number_of_workers',
                                type: 'number',
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'javascript',
            label: 'Javascript',
            form: {
                groups: [
                    {
                        fields: [
                            {
                                label: 'Enable synvert javascript',
                                key: 'enabled',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: true }
                                ]
                            }
                        ]
                    },
                ]
            }
        },
        {
            id: 'typescript',
            label: 'Typescript',
            form: {
                groups: [
                    {
                        fields: [
                            {
                                label: 'Enable synvert typescript',
                                key: 'enabled',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: true }
                                ]
                            }
                        ]
                    },
                ]
            }
        },
    ]
});

export default preferences
