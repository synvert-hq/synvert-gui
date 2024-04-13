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

import React from "react";
import toast from "react-hot-toast";
import {
  formatCommandResult,
  handleTestResults,
  runSynvertRuby,
  runSynvertJavascript,
  DependencyResponse,
  checkRubyDependencies,
  checkJavascriptDependencies,
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
  isAddFileAction,
  languageEnabled,
  cssMaxFileSize,
  lessMaxFileSize,
  sassMaxFileSize,
  scssMaxFileSize,
} from "./utils";

const runCommand = async (command, args, { input } = {}) => {
  try {
    log({ type: "runCommand", command: [command].concat(args).join(" ") });
    const { stdout, stderr } = await window.electronAPI.runShellCommand(command, args, input);
    log({ type: "runCommand", stdout, stderr });
    return formatCommandResult({ stdout, stderr });
  } catch (e) {
    log({ type: "runCommand error", e });
    return { error: e.message };
  }
};

const installGem = async (name) => {
  const { error } = await runCommand("gem", ["install", name]);
  if (error) {
    toast.error(`Failed to install the ${name} gem. ` + error);
  } else {
    toast.success(`Successfully installed the ${name} gem.`);
  }
};

const installNpm = async (name) => {
  const { error } = await runCommand("npm", ["install", "-g", name]);
  if (error) {
    toast.error(`Failed to install the ${name} npm. ` + error);
  } else {
    toast.success(`Successfully installed the ${name} npm.`);
  }
};

const showErrorMessage = (message, buttonTitle, buttonAction) => {
  toast(
    (t) => (
      <div>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          {buttonTitle && buttonAction && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                buttonAction();
                toast.dismiss(t.id);
              }}
            >
              {buttonTitle}
            </button>
          )}
          <button className="btn btn-info btn-sm" onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </div>
      </div>
    ),
    { duration: Infinity },
  );
};

const checkRuby = async () => {
  if (!rubyEnabled()) {
    return;
  }
  const response = await checkRubyDependencies(runCommand);
  switch (response.code) {
    case DependencyResponse.ERROR:
      showErrorMessage(`Error when checking synvert-ruby environment: ${response.error}`);
      break;
    case DependencyResponse.RUBY_NOT_AVAILABLE:
      showErrorMessage("ruby is not available");
      break;
    case DependencyResponse.SYNVERT_NOT_AVAILABLE:
      showErrorMessage("Synvert gem not found. Run `gem install synvert`.", "Install Now", () => installGem("synvert"));
      break;
    case DependencyResponse.SYNVERT_OUTDATED:
      showErrorMessage(
        `synvert gem version ${response.remoteSynvertVersion} is available. (Current version: ${response.localSynvertVersion})`,
        "Update Now",
        () => installGem("synvert"),
      );
      break;
    case DependencyResponse.SYNVERT_CORE_OUTDATED:
      showErrorMessage(
        `synvert-core gem version ${response.remoteSynvertCoreVersion} is available. (Current Version: ${response.localSynvertCoreVersion})`,
        "Update Now",
        () => installGem("synvert-core"),
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
  const response = await checkJavascriptDependencies(runCommand);
  switch (response.code) {
    case DependencyResponse.ERROR:
      showErrorMessage(`Error when checking synvert-javascript environment: ${response.error}`);
      break;
    case DependencyResponse.JAVASCRIPT_NOT_AVAILABLE:
      showErrorMessage("javascript (node) is not available");
      break;
    case DependencyResponse.SYNVERT_NOT_AVAILABLE:
      showErrorMessage("Synvert gem not found. Run `gem install synvert`.", "Install Now", () => installGem("synvert"));
      break;
    case DependencyResponse.SYNVERT_OUTDATED:
      showErrorMessage(
        `synvert npm version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`,
        "Update Now",
        () => installNpm("synvert"),
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
  const additionalCommandArgs = buildAdditionalCommandArgs(language);
  const synvertCommand = language === "ruby" ? runSynvertRuby : runSynvertJavascript;
  const { output, error } = await synvertCommand(
    runCommand,
    "test",
    rootPath,
    onlyPaths,
    skipPaths,
    additionalCommandArgs,
    snippetCode,
  );
  if (error) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error });
    return;
  }
  const { results, errorMessage } = await handleTestResults(
    output,
    error,
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
  const additionalCommandArgs = buildAdditionalCommandArgs(language);
  const synvertCommand = language === "ruby" ? runSynvertRuby : runSynvertJavascript;
  const { output, error } = await synvertCommand(
    runCommand,
    "run",
    rootPath,
    onlyPaths,
    skipPaths,
    additionalCommandArgs,
    snippetCode,
  );
  if (error) {
    triggerEvent(EVENT_SNIPPET_RUN, { error });
    return;
  }
  try {
    triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: JSON.parse(output).affected_files });
  } catch (e) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: e.message });
  }
};

const updateRubyDependencies = async () => {
  const { error } = await runCommand("gem", [
    "install",
    "synvert",
    "synvert-core",
    "node_query",
    "node_mutation",
    "parser_node_ext",
    "syntax_tree_ext",
  ]);
  if (error) {
    return { error };
  }
  const result = await runCommand("synvert-ruby", ["--sync"]);
  return { error: result.error };
};

const updateJavascriptDependencies = async () => {
  const { error } = await runCommand("npm", ["install", "-g", "synvert"]);
  if (error) {
    return { error };
  }
  const result = await runCommand("synvert-javascript", ["--sync"]);
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
    toast.error(`Failed to update ${dependencyName} dependencies: ${result.error}`);
  } else {
    toast.success(`Successfully updated ${dependencyName} dependencies.`);
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
