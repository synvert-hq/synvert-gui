const savePreference = (key, value) => {
    const preferences = window.electronAPI.getPreferences()
    if (!preferences.settings) {
        preferences.settings = {}
    }
    preferences.settings[key] = value
    electronAPI.setPreferences(preferences)
}

const getPreference = (key) => {
    const preferences = window.electronAPI.getPreferences()
    return preferences && preferences.settings && preferences.settings[key]
}

const PREFERENCE_SHOW_DIFFS = 'show_diffs'
export const SHOW_DIFFS_ALWAYS_SHOW = 'always_show'
export const SHOW_DIFFS_NEVER_SHOW = 'never_show'
export const SHOW_DIFFS_ASK_ME = 'ask_me'

export const selectShowDiffsAlwaysShow = () => savePreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW)
export const selectShowDiffsNeverShow = () => savePreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_NEVER_SHOW)
export const selectShowDiffsAskMe = () => savePreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_ASK_ME)
export const showDiffsSelected = () => !!getPreference(PREFERENCE_SHOW_DIFFS)
export const showDiffsAlwaysShowSelected = () => getPreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW)
export const showDiffsNeverShowSelected = () => getPreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_NEVER_SHOW)
export const showDiffsAskMeSelected = () => getPreference(PREFERENCE_SHOW_DIFFS, SHOW_DIFFS_ASK_ME)

export const convertSnippetsToStore = (snippets) =>
    snippets.reduce(
        (obj, snippet) => ({
            ...obj,
            [`${snippet.group}/${snippet.name}`]: snippet
        }),
        {}
    );

export const sortSnippets = (snippets) =>
    snippets.sort((a, b) => {
        if (`${a.group}/${a.name}` < `${b.group}/${b.name}`) return -1
        if (`${a.group}/${a.name}` > `${b.group}/${b.name}`) return 1
        return 0
    })

export const searchSnippets = (snippets, term) =>
    snippets.filter(snippet => `${snippet.group}/${snippet.name}`.includes(term))

export const triggerEvent = (name, detail) => {
    if (detail) {
        log({ type: 'triggerEvent', name, detail })
        window.dispatchEvent(new CustomEvent(name, { detail }))
    } else {
        log({ type: 'triggerEvent', name })
        window.dispatchEvent(new Event(name))
    }
}

export const baseUrl = () => window.electronAPI.isDev() ? 'http://localhost:9292' : 'https://api-ruby.synvert.net'

export const log = (...args) => {
    if (window.electronAPI.isDev()) {
        console.log(...args)
    }
}
