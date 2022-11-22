import { app } from 'electron'
import path from 'path'
import ElectronPreferences from 'electron-preferences'

import { showDevTools } from './utils'
import { SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW, SHOW_DIFFS_NEVER_SHOW, SHOW_DIFFS_ASK_ME } from "../constants"

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
        [SETTINGS_SECTION]: {
            [SETTINGS_SHOW_DIFFS]: 'ask_me',
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
            id: SETTINGS_SECTION,
            label: 'Settings',
            icon: 'settings-gear-63',
            form: {
                groups: [
                    {
                        label: 'Settings',
                        fields: [
                            {
                                label: 'Show diffs after running a snippet',
                                key: SETTINGS_SHOW_DIFFS,
                                type: 'radio',
                                options: [
                                    { label: 'Always show', value: SHOW_DIFFS_ALWAYS_SHOW },
                                    { label: "Never show", value: SHOW_DIFFS_NEVER_SHOW },
                                    { label: 'Ask me every time', value: SHOW_DIFFS_ASK_ME }
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
