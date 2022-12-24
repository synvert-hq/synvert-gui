import { ROOT_PATH, ONLY_PATHS, SKIP_PATHS, LANGUAGE, LANGUAGES } from "./constants"

const CUSTOM = "custom";

const savePreference = (section, key, value) => {
    const preferences = window.electronAPI.getPreferences()
    preferences[section][key] = value
    window.electronAPI.setPreferences(preferences)
}

const getPreference = (section, key) => {
    const preferences = window.electronAPI.getPreferences()
    return preferences[section][key]
}

export const saveInited = (inited) => savePreference(CUSTOM, "inited", inited);
export const getInited = () => getPreference(CUSTOM, "inited");

export const rubyEnabled = () => getPreference("ruby", "enabled").includes("yes");
export const rubyNumberOfWorkers = () => getPreference("ruby", "number_of_workers");
export const javascriptEnabled = () => getPreference("javascript", "enabled").includes("yes");
export const javascriptMaxFileSize = () => getPreference("javascript", "max_file_size");
export const typescriptEnabled = () => getPreference("typescript", "enabled").includes("yes");
export const typescriptMaxFileSize = () => getPreference("typescript", "max_file_size");
export const languageEnabled = (language) => getPreference(language, "enabled").includes("yes");
export const saveLanguageEnabled = (language, enabled) => {
  if (enabled) {
    savePreference(language, "enabled", ["yes"]);
  } else {
    savePreference(language, "enabled", []);
  }
}

export const firstEnabledLanguage = () => LANGUAGES.find(language => languageEnabled(language));
export const getLanguage = () => {
  const language = getPreference(CUSTOM, LANGUAGE);
  if (!language) {
    return firstEnabledLanguage();
  }
  if (!languageEnabled(language)) {
    return firstEnabledLanguage();
  }
  return language;
}
export const saveLanguage = (language) => savePreference(CUSTOM, LANGUAGE, language);

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
            [snippet.id]: snippet
        }),
        {}
    );


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

const composeRubyGeneratedSnippet = (data, result) => {
    let generatedSnippet = "Synvert::Rewriter.new 'group', 'name' do\n";
    if (data.rubyVersion) {
      generatedSnippet += `  if_ruby '${data.rubyVersion}'\n`;
    }
    if (data.gemVersion) {
      const index = data.gemVersion.indexOf(" ");
      const name = data.gemVersion.substring(0, index);
      const version = data.gemVersion.substring(index + 1);
      generatedSnippet += `  if_gem '${name}', '${version}'\n`;
    }
    generatedSnippet += `  within_files '${data.filePattern}' do\n`;
    if (result.snippet) {
      generatedSnippet += "    ";
      generatedSnippet += result.snippet.replace(/\n/g, "\n    ");
      generatedSnippet += "\n";
    }
    generatedSnippet += "  end\n";
    generatedSnippet += "end";
    return generatedSnippet;
};

const composeJavascriptGeneratedSnippet = (data, result) => {
    let generatedSnippet = `const Synvert = require("synvert-core");\n\nnew Synvert::Rewriter("group", "name", () => {\n`;
    if (data.nodeVersion) {
      generatedSnippet += `  ifNode("${data.nodeVersion}");\n`;
    }
    if (data.npmVersion) {
      const index = data.npmVersion.indexOf(" ");
      const name = data.npmVersion.substring(0, index);
      const version = data.npmVersion.substring(index + 1);
      generatedSnippet += `  ifNpm("${name}", "${version}");\n`;
    }
    generatedSnippet += `  withinFiles("${data.filePattern}", () => {\n`;
    if (result.snippet) {
      generatedSnippet += "    ";
      generatedSnippet += result.snippet.replace(/\n/g, "\n    ");
      generatedSnippet += "\n";
    }
    generatedSnippet += "  });\n";
    generatedSnippet += "});";
    return generatedSnippet;
};

export const composeGeneratedSnippet = (language, data, result) => {
    if (language === "ruby") {
      return composeRubyGeneratedSnippet(data, result);
    } else {
      return composeJavascriptGeneratedSnippet(data, result);
    }
}

const LOCAL_API_SERVERS = {
    ruby: 'http://localhost:9292',
    javascript: 'http://localhost:4000',
    typescript: 'http://localhost:4000',
}

const REMOTE_API_SERVERS = {
    ruby: 'https://api-ruby.synvert.net',
    javascript: 'https://api-javascript.synvert.net',
    typescript: 'https://api-javascript.synvert.net',
}

export const baseUrlByLanguage = (language) => {
    if (window.electronAPI.isDev()) {
        return LOCAL_API_SERVERS[language];
    } else {
        return REMOTE_API_SERVERS[language];
    }
}

const PLACEHODERS = {
  ruby: {
    input: "FactoryBot.create(:user)",
    output: "create(:user)",
  },
  javascript: {
    input: "foo.substring(indexStart, indexEnd)",
    output: "foo.slice(indexStart, indexEnd)",
  },
  typescript: {
    input: "const x: Array<string> = ['a', 'b']",
    output: "const x: string[] = ['a', 'b']",
  }
}

export const placeholderByLanguage = (language) => PLACEHODERS[language];

const DEFAULT_VALUES = {
  ruby: "**/*.rb",
  javascript: "**/*.js",
  typescript: "**/*.ts",
}

export const defaultValueByLanguage = (language) => DEFAULT_VALUES[language];

export const log = (...args) => {
    if (window.electronAPI.isDev()) {
        console.log(...args)
    }
}
