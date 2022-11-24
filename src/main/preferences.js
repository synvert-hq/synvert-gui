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
            enabled: ['yes'],
            number_of_workers: 4,
        },
        javascript: {
            enabled: ['yes']
        },
        typescript: {
            enabled: ['yes']
        },
        custom: {}
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
                                    { label: 'Enabled', value: 'yes' }
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
                                    { label: 'Enabled', value: 'yes' }
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
                                    { label: 'Enabled', value: 'yes' }
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
