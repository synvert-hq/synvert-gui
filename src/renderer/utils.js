import { SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW, SHOW_DIFFS_NEVER_SHOW, SHOW_DIFFS_ASK_ME } from "../constants"
import { WORKING_DIR, ONLY_PATHS, SKIP_PATHS } from "./constants"

const savePreference = (section, key, value) => {
    const preferences = window.electronAPI.getPreferences()
    preferences[section][key] = value
    window.electronAPI.setPreferences(preferences)
}

const getPreference = (section, key) => {
    const preferences = window.electronAPI.getPreferences()
    return preferences[section][key]
}

export const selectShowDiffsAlwaysShow = () => savePreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW)
export const selectShowDiffsNeverShow = () => savePreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_NEVER_SHOW)
export const selectShowDiffsAskMe = () => savePreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_ASK_ME)
export const showDiffsSelected = () => !!getPreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS)
export const showDiffsAlwaysShowSelected = () => getPreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS) === SHOW_DIFFS_ALWAYS_SHOW
export const showDiffsNeverShowSelected = () => getPreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS) === SHOW_DIFFS_NEVER_SHOW
export const showDiffsAskMeSelected = () => getPreference(SETTINGS_SECTION, SETTINGS_SHOW_DIFFS) === SHOW_DIFFS_ASK_ME

export const getWorkingDir = () => localStorage.getItem(WORKING_DIR);
export const saveWorkingDir = (path) => localStorage.setItem(WORKING_DIR, path);

export const getOnlyPaths = () => localStorage.getItem(getWorkingDir() + ":" + ONLY_PATHS);
export const saveOnlyPaths = (path) => localStorage.setItem(getWorkingDir() + ":" + ONLY_PATHS, path);

export const getSkipPaths = () => localStorage.getItem(getWorkingDir() + ":" + SKIP_PATHS);
export const saveSkipPaths = (path) => localStorage.setItem(getWorkingDir() + ":" + SKIP_PATHS, path);

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
