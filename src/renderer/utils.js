import { ROOT_PATH, ONLY_PATHS, SKIP_PATHS, LANGUAGE } from "./constants"

const savePreference = (section, key, value) => {
    const preferences = window.electronAPI.getPreferences()
    preferences[section][key] = value
    window.electronAPI.setPreferences(preferences)
}

export const getPreference = (section, key) => {
    const preferences = window.electronAPI.getPreferences()
    return preferences[section][key]
}

export const getLanguage = () => localStorage.getItem(LANGUAGE) || "ruby";
export const saveLanguage = (language) => localStorage.setItem(LANGUAGE, language);

export const getRootPath = () => localStorage.getItem(ROOT_PATH) || "";
export const saveRootPath = (path) => localStorage.setItem(ROOT_PATH, path);

export const getOnlyPaths = () => localStorage.getItem(getRootPath() + ":" + ONLY_PATHS) || "";
export const saveOnlyPaths = (path) => localStorage.setItem(getRootPath() + ":" + ONLY_PATHS, path);

export const getSkipPaths = () => localStorage.getItem(getRootPath() + ":" + SKIP_PATHS) || "**/node_modules/**,**/dist/**";
export const saveSkipPaths = (path) => localStorage.setItem(getRootPath() + ":" + SKIP_PATHS, path);

export const convertSnippetsToStore = (snippets) =>
    snippets.reduce(
        (obj, snippet) => ({
            ...obj,
            [snippet.id]: snippet
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

const snakeToCamel = (str) => str.replace(/([-_]\w)/g, g => g[1].toUpperCase());

export const parseJSON = (str) => {
  return JSON.parse(str, function(key, value) {
    const camelCaseKey = snakeToCamel(key);

    if (this instanceof Array || camelCaseKey === key) {
      return value;
    } else {
      this[camelCaseKey] = value;
    }
  });
};

export const getNewSource = (oldSource, testResult) => {
    let newSource = oldSource;
    JSON.parse(JSON.stringify(testResult.actions)).reverse().forEach(action => {
        newSource = newSource.slice(0, action.start) + action.newCode + newSource.slice(action.end);
    });
    return newSource;
}

export const baseUrl = () => window.electronAPI.isDev() ? 'http://localhost:9292' : 'https://api-ruby.synvert.net'

export const log = (...args) => {
    if (window.electronAPI.isDev()) {
        console.log(...args)
    }
}
