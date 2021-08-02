import { ipcRenderer } from 'electron';

const savePreference = (key, value) => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    if (!preferences.settings) {
        preferences.settings = {}
    }
    preferences.settings[key] = value
    ipcRenderer.sendSync('setPreferences', preferences)
}

const getPreference = (key) => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences && preferences.settings && preferences.settings[key]
}

const PREFERENCE_DEPENDENCY = 'dependency'
export const DOCKER_DEPENDENCY = 'docker'
export const NATIVE_DEPENDENCY = 'native'

export const selectDockerDependency = () => savePreference(PREFERENCE_DEPENDENCY, DOCKER_DEPENDENCY)
export const selectNativeDependency = () => savePreference(PREFERENCE_DEPENDENCY, NATIVE_DEPENDENCY)
export const dependencySelected = () => !!getPreference(PREFERENCE_DEPENDENCY)
export const dockerDependencySelected = () => getPreference(PREFERENCE_DEPENDENCY) === DOCKER_DEPENDENCY
export const nativeDependencySelected = () => getPreference(PREFERENCE_DEPENDENCY) === NATIVE_DEPENDENCY

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

export const host = () => process.env.DEBUG === 'true' ? 'http://localhost:9292' : 'https://synvert.xinminlabs.com'

export const log = (...args) => {
    if (process.env.DEBUG === 'true') {
        console.log(...args)
    }
}