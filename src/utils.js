const DEPENDENCY = 'dependency'
export const DOCKER_DEPENDENCY = 'docker'
export const NATIVE_DEPENDENCY = 'native'

export const selectDockerDependency = () => window.localStorage.setItem(DEPENDENCY, DOCKER_DEPENDENCY)
export const selectNativeDependency = () => window.localStorage.setItem(DEPENDENCY, NATIVE_DEPENDENCY)
export const dependencySelected = () => !!window.localStorage.getItem(DEPENDENCY)
export const dockerDependencySelected = () => window.localStorage.getItem(DEPENDENCY) === DOCKER_DEPENDENCY
export const nativeDependencySelected = () => window.localStorage.getItem(DEPENDENCY) === NATIVE_DEPENDENCY

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