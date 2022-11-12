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
    sections: [
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
