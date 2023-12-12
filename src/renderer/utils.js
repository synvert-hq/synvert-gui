import { ROOT_PATH, ONLY_PATHS, SKIP_PATHS, LANGUAGE, LANGUAGES, PARSER } from "./constants";

const CUSTOM = "custom";

const savePreference = (section, key, value) => {
  const preferences = window.electronAPI.getPreferences();
  preferences[section][key] = value;
  window.electronAPI.setPreferences(preferences);
};

const getPreference = (section, key) => {
  const preferences = window.electronAPI.getPreferences();
  return preferences[section][key];
};

export const saveInited = (inited) => savePreference(CUSTOM, "inited", inited);
export const getInited = () => getPreference(CUSTOM, "inited");

export const rubyEnabled = () => getPreference("ruby", "enabled").includes("yes");
export const rubyNumberOfWorkers = () => getPreference("ruby", "number_of_workers");
export const rubySingleQuote = () => getPreference("ruby", "single_quote").includes("yes");
export const rubyTabWidth = () => getPreference("ruby", "tab_width");
export const javascriptEnabled = () => getPreference("javascript", "enabled").includes("yes");
export const javascriptMaxFileSize = () => getPreference("javascript", "max_file_size");
export const javascriptSingleQuote = () => getPreference("javascript", "single_quote").includes("yes");
export const javascriptSemi = () => getPreference("javascript", "semi").includes("yes");
export const javascriptTabWidth = () => getPreference("javascript", "tab_width");
export const typescriptEnabled = () => getPreference("typescript", "enabled").includes("yes");
export const typescriptMaxFileSize = () => getPreference("typescript", "max_file_size");
export const typescriptSingleQuote = () => getPreference("typescript", "single_quote").includes("yes");
export const typescriptSemi = () => getPreference("typescript", "semi").includes("yes");
export const typescriptTabWidth = () => getPreference("typescript", "tab_width");
export const languageEnabled = (language) => getPreference(language, "enabled").includes("yes");
export const saveLanguageEnabled = (language, enabled) => {
  if (enabled) {
    savePreference(language, "enabled", ["yes"]);
  } else {
    savePreference(language, "enabled", []);
  }
};

export const firstEnabledLanguage = () => LANGUAGES.find((language) => languageEnabled(language));
export const getLanguage = () => {
  const language = getPreference(CUSTOM, LANGUAGE);
  if (!language) {
    return firstEnabledLanguage();
  }
  if (!languageEnabled(language)) {
    return firstEnabledLanguage();
  }
  return language;
};
export const saveLanguage = (language) => savePreference(CUSTOM, LANGUAGE, language);

export const getParser = () => getPreference(CUSTOM, PARSER) || PARSERS[getLanguage()][0];
export const saveParser = (parser) => savePreference(CUSTOM, PARSER, parser);

export const getRootPath = () => getPreference(CUSTOM, ROOT_PATH) || "";
export const saveRootPath = (path) => savePreference(CUSTOM, ROOT_PATH, path);

export const getOnlyPaths = () => getPreference(CUSTOM, getRootPath() + ":" + ONLY_PATHS) || "";
export const saveOnlyPaths = (path) => savePreference(CUSTOM, getRootPath() + ":" + ONLY_PATHS, path);

export const getSkipPaths = () => getPreference(CUSTOM, getRootPath() + ":" + SKIP_PATHS) || "";
export const saveSkipPaths = (path) => savePreference(CUSTOM, getRootPath() + ":" + SKIP_PATHS, path);

export const convertSnippetsToStore = (snippets) =>
  snippets.reduce(
    (obj, snippet) => ({
      ...obj,
      [snippet.id]: snippet,
    }),
    {},
  );

export const triggerEvent = (name, detail) => {
  if (detail) {
    log({ type: "triggerEvent", name, detail });
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } else {
    log({ type: "triggerEvent", name });
    window.dispatchEvent(new Event(name));
  }
};

export const isAddFileAction = (result) => result.actions.length === 1 && result.actions[0].type === "add_file";

export const isRemoveFileAction = (result) => result.actions.length === 1 && result.actions[0].type === "remove_file";

export const log = (...args) => {
  if (window.electronAPI.isDev()) {
    console.log(...args);
  }
};
