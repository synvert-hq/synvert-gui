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
            single_quote: ['yes'],
            tab_width: 2,
        },
        javascript: {
            enabled: ['yes'],
            max_file_size: 100,
            single_quote: ['no'],
            semi: ['yes'],
            tab_width: 2,
        },
        typescript: {
            enabled: ['yes'],
            max_file_size: 100,
            single_quote: ['no'],
            semi: ['yes'],
            tab_width: 2,
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
                            },
                            {
                                label: 'Prefer single quote',
                                key: 'single_quote',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: 'yes' }
                                ]
                            },
                            {
                                label: 'Prefer tab width',
                                key: 'tab_width',
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
                            },
                            {
                                label: 'Skip file if its size is more than the size. (KB)',
                                key: 'max_file_size',
                                type: 'number',
                            },
                            {
                                label: 'Prefer single quote',
                                key: 'single_quote',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: 'yes' }
                                ]
                            },
                            {
                                label: 'Prefer semicolon',
                                key: 'semi',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: 'yes' }
                                ]
                            },
                            {
                                label: 'Prefer tab width',
                                key: 'tab_width',
                                type: 'number',
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
                            },
                            {
                                label: 'Skip file if its size is more than the size. (KB)',
                                key: 'max_file_size',
                                type: 'number',
                            },
                            {
                                label: 'Prefer single quote',
                                key: 'single_quote',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: 'yes' }
                                ]
                            },
                            {
                                label: 'Prefer semicolon',
                                key: 'semi',
                                type: 'checkbox',
                                options: [
                                    { label: 'Enabled', value: 'yes' }
                                ]
                            },
                            {
                                label: 'Prefer tab width',
                                key: 'tab_width',
                                type: 'number',
                            }
                        ]
                    },
                ]
            }
        },
    ]
});

export default preferences
