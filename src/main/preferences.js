const { app } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev')
const ElectronPreferences = require('electron-preferences');

const preferences = new ElectronPreferences({
    dataStore: path.join(app.getPath('userData'), 'preferences.json'),
    webPreferences: {
        devTools: isDev
    },
    browserWindowOverrides: {
        title: 'Snippets Preferences',
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
                                label: 'Dependency',
                                key: 'dependency',
                                type: 'radio',
                                options: [
                                    { label: 'Docker (Recommended)', value: 'docker' },
                                    { label: 'Native', value: 'native' }
                                ]
                            },
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

module.exports = preferences