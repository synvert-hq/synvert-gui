import { SETTINGS_SECTION, SETTINGS_SHOW_DIFFS, SHOW_DIFFS_ALWAYS_SHOW, SHOW_DIFFS_NEVER_SHOW, SHOW_DIFFS_ASK_ME, GENERAL_SECTION, GENERAL_WORKING_DIR } from "../constants"

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

export const getWorkingDir = () => getPreference(GENERAL_SECTION, GENERAL_WORKING_DIR);
export const setWorkingDir = (path) => savePreference(GENERAL_SECTION, GENERAL_WORKING_DIR, path);

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

export const baseUrl = () => window.electronAPI.isDev() ? 'http://localhost:9292' : 'https://api-ruby.synvert.net'

export const log = (...args) => {
    if (window.electronAPI.isDev()) {
        console.log(...args)
    }
}
