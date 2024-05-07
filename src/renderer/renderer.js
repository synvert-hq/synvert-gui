/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./app.jsx";
import "./index.css";

import {
  handleTestResults,
  runSynvertRuby,
  runSynvertJavascript,
  DependencyResponse,
  checkRubyDependencies,
  checkJavascriptDependencies,
  installGem,
  installNpm,
  syncRubySnippets,
  syncJavascriptSnippets
} from "@synvert-hq/synvert-ui-common";

import {
  EVENT_TEST_SNIPPET,
  EVENT_SNIPPET_TESTED,
  EVENT_RUN_SNIPPET,
  EVENT_SNIPPET_RUN,
  EVENT_CHECK_DEPENDENCIES,
  EVENT_UPDATE_DEPENDENCIES,
  EVENT_DEPENDENCIES_UPDATED,
} from "./constants";
import {
  rubyNumberOfWorkers,
  log,
  triggerEvent,
  rubyEnabled,
  javascriptEnabled,
  typescriptEnabled,
  getInited,
  javascriptMaxFileSize,
  typescriptMaxFileSize,
  rubySingleQuote,
  rubyTabWidth,
  javascriptSemi,
  javascriptSingleQuote,
  javascriptTabWidth,
  typescriptSingleQuote,
  typescriptSemi,
  typescriptTabWidth,
  languageEnabled,
  cssMaxFileSize,
  lessMaxFileSize,
  sassMaxFileSize,
  scssMaxFileSize,
  showMessage,
  showErrorMessageWithAction,
  rubyBinPath,
  javascriptBinPath,
} from "./utils";

const runCommand = async (command, args, { input } = {}) => {
  try {
    log({ type: "runCommand", command: [command].concat(args).join(" ") });
    const { stdout, stderr } = await window.electronAPI.runShellCommand(command, args, input);
    log({ type: "runCommand", stdout, stderr });
    return { stdout, stderr };
  } catch (e) {
    log({ type: "runCommand error", e });
    return { stderr: e.message };
  }
};

const runGemInstall = async (gemName) => {
  const binPath = rubyBinPath();
  const { stderr } = await installGem({ runCommand, gemName, binPath });
  if (stderr) {
    showMessage(`Failed to install the ${gemName} gem. ${stderr}`);
  } else {
    showMessage(`Successfully installed the ${gemName} gem.`);
  }
};

const runNpmInstall = async (npmName) => {
  const binPath = javascriptBinPath();
  const { stderr } = await installNpm({ runCommand, npmName, binPath });
  if (stderr) {
    showMessage(`Failed to install the ${npmName} npm. ${stderr}`);
  } else {
    showMessage(`Successfully installed the ${npmName} npm.`);
  }
};

const checkRuby = async () => {
  if (!rubyEnabled()) {
    return;
  }
  const binPath = rubyBinPath();
  const response = await checkRubyDependencies({ runCommand, binPath });
  switch (response.code) {
    case DependencyResponse.ERROR:
      showMessage(`Error when checking synvert-ruby environment: ${response.error}`);
      break;
    case DependencyResponse.RUBY_NOT_AVAILABLE:
      showMessage("ruby is not available");
      break;
    case DependencyResponse.SYNVERT_NOT_AVAILABLE:
      showErrorMessageWithAction("Synvert gem not found. Run `gem install synvert`.", "Install Now", () => runGemInstall("synvert"));
      break;
    case DependencyResponse.SYNVERT_OUTDATED:
      showErrorMessageWithAction(
        `synvert gem version ${response.remoteSynvertVersion} is available. (Current version: ${response.localSynvertVersion})`,
        "Update Now",
        () => runGemInstall("synvert"),
      );
      break;
    case DependencyResponse.SYNVERT_CORE_OUTDATED:
      showErrorMessageWithAction(
        `synvert-core gem version ${response.remoteSynvertCoreVersion} is available. (Current Version: ${response.localSynvertCoreVersion})`,
        "Update Now",
        () => runGemInstall("synvert-core"),
      );
      break;
  }
};

const checkJavascript = async () => {
  if (
    !javascriptEnabled() &&
    !typescriptEnabled() &&
    !cssEnabled() &&
    !lessEnabled() &&
    !sassEnabled() &&
    !scssEnabled()
  ) {
    return;
  }
  const binPath = javascriptBinPath();
  const response = await checkJavascriptDependencies({ runCommand, binPath });
  switch (response.code) {
    case DependencyResponse.ERROR:
      showMessage(`Error when checking synvert-javascript environment: ${response.error}`);
      break;
    case DependencyResponse.JAVASCRIPT_NOT_AVAILABLE:
      showMessage("javascript (node) is not available");
      break;
    case DependencyResponse.SYNVERT_NOT_AVAILABLE:
      showErrorMessageWithAction("Synvert npm not found. Run `npm install -g @synvert-hq/synvert`.", "Install Now", () => runNpmInstall("@synvert-hq/synvert"));
      break;
    case DependencyResponse.SYNVERT_OUTDATED:
      showErrorMessageWithAction(
        `@synvert-hq/synvert npm version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`,
        "Update Now",
        () => runNpmInstall("@synvert-hq/synvert"),
      );
      break;
  }
};

const checkDependencies = async () => {
  try {
    Promise.all(
      [checkRuby, checkJavascript].map(async (fn) => {
        await fn();
      }),
    );
  } catch (error) {
    log({ error });
  }
};

const testSnippet = async (event) => {
  const {
    detail: { language },
  } = event;
  if (!languageEnabled(language)) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: `Synvert ${language} is not enabled!` });
    return;
  }
  const {
    detail: { snippetCode, rootPath, onlyPaths, skipPaths },
  } = event;
  const additionalArgs = buildAdditionalCommandArgs(language);
  const synvertCommand = language === "ruby" ? runSynvertRuby : runSynvertJavascript;
  const binPath = language === "ruby" ? rubyBinPath() : javascriptBinPath();
  const { stdout, stderr } = await synvertCommand({
    runCommand,
    executeCommand: "test",
    rootPath,
    onlyPaths,
    skipPaths,
    additionalArgs,
    snippetCode,
    binPath,
  });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: stderr });
    return;
  }
  const { results, errorMessage } = await handleTestResults(
    stdout,
    stderr,
    rootPath,
    window.electronAPI.pathAPI,
    window.electronAPI.promiseFsAPI,
  );
  triggerEvent(EVENT_SNIPPET_TESTED, { testResults: results, error: errorMessage });
};

const runSnippet = async (event) => {
  const {
    detail: { language },
  } = event;
  if (!languageEnabled(language)) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: `Synvert ${language} is not enabled!` });
    return;
  }
  const {
    detail: { snippetCode, rootPath, onlyPaths, skipPaths },
  } = event;
  const additionalArgs = buildAdditionalCommandArgs(language);
  const synvertCommand = language === "ruby" ? runSynvertRuby : runSynvertJavascript;
  const binPath = language === "ruby" ? rubyBinPath() : javascriptBinPath();
  const { stdout, stderr } = await synvertCommand({
    runCommand,
    executeCommand: "run",
    rootPath,
    onlyPaths,
    skipPaths,
    additionalArgs,
    snippetCode,
    binPath,
  });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: stderr });
    return;
  }
  try {
    triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: JSON.parse(output).affected_files });
  } catch (e) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: e.message });
  }
};

const updateRubyDependencies = async () => {
  const binPath = rubyBinPath();
  const { stderr } = await installGem({
    runCommand,
    gemName: ["synvert", "synvert-core", "node_query", "node_mutation", "parser_node_ext", "syntax_tree_ext", "prism_ext"],
    binPath,
  });
  if (stderr) {
    return { error: stderr };
  }
  const result = await syncRubySnippets({ runCommand, binPath });
  return { error: result.error };
};

const updateJavascriptDependencies = async () => {
  const binPath = javascriptBinPath();
  const { stderr } = await installNpm({
    runCommand,
    npmName: "@synvert-hq/synvert",
    binPath,
  });
  if (stderr) {
    return { error: stderr };
  }
  const result = await syncJavascriptSnippets({ runCommand, binPath });
  return { error: result.error };
};

const updateDependencies = async (event) => {
  const {
    detail: { language },
  } = event;
  let result;
  let dependencyName;
  if (language === "ruby") {
    result = await updateRubyDependencies();
    dependencyName = "synvert-ruby";
  } else {
    result = await updateJavascriptDependencies();
    dependencyName = "synvert-javascript";
  }
  if (result.error) {
    showMessage(`Failed to update ${dependencyName} dependencies: ${result.error}`);
  } else {
    showMessage(`Successfully updated ${dependencyName} dependencies.`);
  }
  triggerEvent(EVENT_DEPENDENCIES_UPDATED, { error: result.error });
};

function buildAdditionalCommandArgs(language) {
  const additionalCommandArgs = [];
  switch (language) {
    case "ruby":
      additionalCommandArgs.push("--number-of-workers", rubyNumberOfWorkers(), "--tab-width", rubyTabWidth());
      if (!rubySingleQuote()) {
        additionalCommandArgs.push("--double-quote");
      }
      break;
    case "javascript":
      additionalCommandArgs.push(
        "--max-file-size",
        javascriptMaxFileSize() * 1024,
        "--tab-width",
        javascriptTabWidth(),
      );
      if (javascriptSingleQuote()) {
        additionalCommandArgs.push("--single-quote");
      }
      if (!javascriptSemi()) {
        additionalCommandArgs.push("--no-semi");
      }
      break;
    case "typescript":
      additionalCommandArgs.push(
        "--max-file-size",
        typescriptMaxFileSize() * 1024,
        "--tab-width",
        typescriptTabWidth(),
      );
      if (typescriptSingleQuote()) {
        additionalCommandArgs.push("--single-quote");
      }
      if (!typescriptSemi()) {
        additionalCommandArgs.push("--no-semi");
      }
      break;
    case "css":
      additionalCommandArgs.push("--max-file-size", cssMaxFileSize() * 1024);
      break;
    case "less":
      additionalCommandArgs.push("--max-file-size", lessMaxFileSize() * 1024);
      break;
    case "sass":
      additionalCommandArgs.push("--max-file-size", sassMaxFileSize() * 1024);
      break;
    case "scss":
      additionalCommandArgs.push("--max-file-size", scssMaxFileSize() * 1024);
      break;
  }
  return additionalCommandArgs;
}

window.addEventListener(EVENT_TEST_SNIPPET, testSnippet);
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet);
window.addEventListener(EVENT_UPDATE_DEPENDENCIES, updateDependencies);
// check dependencies after first inited.
window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies);

if (getInited()) {
  // check dependencies every time app starts
  setTimeout(checkDependencies, 100);
}
