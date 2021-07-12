import { ipcRenderer } from 'electron';

export const DOCKER_DEPENDENCY = 'docker'
export const NATIVE_DEPENDENCY = 'native'

export const selectDockerDependency = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    preferences.settings.dependency = DOCKER_DEPENDENCY
    ipcRenderer.sendSync('setPreferences', preferences)
}
export const selectNativeDependency = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    preferences.settings.dependency = NATIVE_DEPENDENCY
    ipcRenderer.sendSync('setPreferences', preferences)
}
export const dependencySelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return !!(preferences && preferences.settings && preferences.settings.dependency)
}
export const dockerDependencySelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences.settings.dependency === DOCKER_DEPENDENCY
}
export const nativeDependencySelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences.settings.dependency === NATIVE_DEPENDENCY
}

export const SHOW_DIFFS_ALWAYS_SHOW = 'always_show'
export const SHOW_DIFFS_NEVER_SHOW = 'never_show'
export const SHOW_DIFFS_ASK_ME = 'ask_me'

export const selectShowDiffsAlwaysShow = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    preferences.settings.show_diffs = SHOW_DIFFS_ALWAYS_SHOW
    ipcRenderer.sendSync('setPreferences', preferences)
}
export const selectShowDiffsNeverShow = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    preferences.settings.show_diffs = SHOW_DIFFS_NEVER_SHOW
    ipcRenderer.sendSync('setPreferences', preferences)
}
export const selectShowDiffsAskMe = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    preferences.settings.show_diffs = SHOW_DIFFS_ASK_ME
    ipcRenderer.sendSync('setPreferences', { settings: { show_diffs: SHOW_DIFFS_ASK_ME } })
}
export const showDiffsSelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return !!(preferences && preferences.settings && preferences.settings.show_diffs)
}
export const showDiffsAlwaysShowSelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences.settings.show_diffs === SHOW_DIFFS_ALWAYS_SHOW
}
export const showDiffsNeverShowSelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences.settings.show_diffs === SHOW_DIFFS_NEVER_SHOW
}
export const showDiffsAskMeSelected = () => {
    const preferences = ipcRenderer.sendSync('getPreferences')
    return preferences.settings.show_diffs === SHOW_DIFFS_ASK_ME
}

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

export const log = (...args) => {
    if (process.env.DEBUG === 'true') {
        console.log(...args)
    }
}