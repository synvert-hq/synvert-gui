const { ipcRenderer } = require('electron');

export const DOCKER_DEPENDENCY = 'docker'
export const NATIVE_DEPENDENCY = 'native'

export const selectDockerDependency = () => ipcRenderer.sendSync('setPreferences', { settings: { dependency: DOCKER_DEPENDENCY } })
export const selectNativeDependency = () => ipcRenderer.sendSync('setPreferences', { settings: { dependency: NATIVE_DEPENDENCY } })
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
        window.dispatchEvent(new CustomEvent(name, { detail }))
    } else {
        window.dispatchEvent(new Event(name))
    }
}