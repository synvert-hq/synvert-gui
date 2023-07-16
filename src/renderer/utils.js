import { ROOT_PATH, ONLY_PATHS, SKIP_PATHS, LANGUAGE, LANGUAGES } from "./constants";

const CUSTOM = "custom";
export const DEFAULT_VALUES = {
  ruby: {
    enabled: ["yes"],
    number_of_workers: 4,
    single_quote: ["yes"],
    tab_width: 2,
  },
  javascript: {
    enabled: ["yes"],
    max_file_size: 100,
    single_quote: ["no"],
    semi: ["yes"],
    tab_width: 2,
  },
  typescript: {
    enabled: ["yes"],
    max_file_size: 100,
    single_quote: ["no"],
    semi: ["yes"],
    tab_width: 2,
  },
  css: {
    enabled: ["yes"],
    max_file_size: 100,
  },
  less: {
    enabled: ["yes"],
    max_file_size: 100,
  },
  sass: {
    enabled: ["yes"],
    max_file_size: 100,
  },
  scss: {
    enabled: ["yes"],
    max_file_size: 100,
  },
  [CUSTOM]: {
    [ROOT_PATH]: "",
  },
};

const savePreference = (section, key, value) => {
  const preferences = window.electronAPI.getPreferences();
  if (!preferences[section]) {
    preferences[section] = {};
  }
  preferences[section][key] = value;
  window.electronAPI.setPreferences(preferences);
};

const getPreference = (section, key) => {
  const preferences = window.electronAPI.getPreferences();
  if (!preferences[section]) {
    preferences[section] = {};
  }
  return preferences[section][key] || DEFAULT_VALUES[section][key];
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
export const cssEnabled = () => getPreference("css", "enabled").includes("yes");
export const cssMaxFileSize = () => getPreference("css", "max_file_size");
export const lessEnabled = () => getPreference("less", "enabled").includes("yes");
export const lessMaxFileSize = () => getPreference("less", "max_file_size");
export const sassEnabled = () => getPreference("sass", "enabled").includes("yes");
export const sassMaxFileSize = () => getPreference("sass", "max_file_size");
export const scssEnabled = () => getPreference("scss", "enabled").includes("yes");
export const scssMaxFileSize = () => getPreference("scss", "max_file_size");
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

export const getRootPath = () => getPreference(CUSTOM, ROOT_PATH) || "";
export const saveRootPath = (path) => savePreference(CUSTOM, ROOT_PATH, path);

export const getOnlyPaths = () => getPreference(CUSTOM, getRootPath() + ":" + ONLY_PATHS) || "";
export const saveOnlyPaths = (path) => savePreference(CUSTOM, getRootPath() + ":" + ONLY_PATHS, path);

export const getSkipPaths = () => getPreference(CUSTOM, getRootPath() + ":" + SKIP_PATHS) || "";
export const saveSkipPaths = (path) => savePreference(CUSTOM, getRootPath() + ":" + SKIP_PATHS, path);

export const filterSnippetsByLanguage = (language, snippets) => {
  switch (language) {
    case "ruby":
      return snippets;
    case "javascript":
      return snippets.filter((snippet) => !["typescript", "css", "less", "sass", "scss"].includes(snippet.group));
    case "typescript":
      return snippets.filter((snippet) => !["css", "less", "sass", "scss"].includes(snippet.group));
    case "css":
      return snippets.filter((snippet) => snippet.group === "css");
    case "less":
      return snippets.filter((snippet) => snippet.group === "less");
    case "sass":
      return snippets.filter((snippet) => snippet.group === "sass");
    case "scss":
      return snippets.filter((snippet) => snippet.group === "scss");
  }
};

export const convertSnippetsToStore = (snippets) =>
  snippets.reduce(
    (obj, snippet) => ({
      ...obj,
      [snippet.id]: snippet,
    }),
    {}
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

export const getNewSource = (oldSource, testResult) => {
  if (isAddFileAction(testResult)) {
    return testResult.actions[0].newCode;
  }
  if (isRemoveFileAction(testResult)) {
    return "";
  }

  let newSource = oldSource;
  JSON.parse(JSON.stringify(testResult.actions))
    .reverse()
    .forEach((action) => {
      newSource = newSource.slice(0, action.start) + action.newCode + newSource.slice(action.end);
    });
  return newSource;
};

export const isAddFileAction = (result) => result.actions.length === 1 && result.actions[0].type === "add_file";

export const isRemoveFileAction = (result) => result.actions.length === 1 && result.actions[0].type === "remove_file";

const LOCAL_API_SERVERS = {
  ruby: "http://localhost:9292",
  javascript: "http://localhost:4000",
  typescript: "http://localhost:4000",
  css: "http://localhost:4000",
  less: "http://localhost:4000",
  sass: "http://localhost:4000",
  scss: "http://localhost:4000",
};

const REMOTE_API_SERVERS = {
  ruby: "https://api-ruby.synvert.net",
  javascript: "https://api-javascript.synvert.net",
  typescript: "https://api-javascript.synvert.net",
  css: "https://api-javascript.synvert.net",
  less: "https://api-javascript.synvert.net",
  sass: "https://api-javascript.synvert.net",
  scss: "https://api-javascript.synvert.net",
};

export const baseUrlByLanguage = (language) => {
  if (window.electronAPI.isDev()) {
    return LOCAL_API_SERVERS[language];
  } else {
    return REMOTE_API_SERVERS[language];
  }
};

export const log = (...args) => {
  if (window.electronAPI.isDev()) {
    console.log(...args);
  }
};
