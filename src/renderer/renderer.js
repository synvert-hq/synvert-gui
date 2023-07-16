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
import { compareVersions } from "compare-versions";
import { parseJSON, formatCommandResult } from "synvert-ui-common";

import {
  EVENT_TEST_SNIPPET,
  EVENT_SNIPPET_TESTED,
  EVENT_RUN_SNIPPET,
  EVENT_SNIPPET_RUN,
  EVENT_CHECK_DEPENDENCIES,
} from "./constants";
import {
  rubyNumberOfWorkers,
  log,
  triggerEvent,
  rubyEnabled,
  javascriptEnabled,
  baseUrlByLanguage,
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
  const { output, error } = await runCommand("gem", ["install", name]);
  if (error) {
    toast.error(`Failed to install the ${name} gem. `) + error;
  } else {
    toast.success(`Successfully installed the ${name} gem.`);
  }
};

const installNpm = async (name) => {
  const { output, error } = await runCommand("npm", ["install", "-g", name]);
  if (error) {
    toast.error(`Failed to install the ${name} npm. `) + error;
  } else {
    toast.success(`Successfully installed the ${name} npm.`);
  }
};

const showErrorMesage = (message, buttonTitle, buttonAction) => {
  toast(
    (t) => (
      <div>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              buttonAction();
              toast.dismiss(t.id);
            }}
          >
            {buttonTitle}
          </button>
          <button className="btn btn-info btn-sm" onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};

const VERSION_REGEXP = /(\d+\.\d+\.\d+) \(with synvert-core (\d+\.\d+\.\d+)/;

const checkRubyDependencies = async () => {
  if (!rubyEnabled()) {
    return;
  }
  let { output, error } = await runCommand("ruby", ["--version"]);
  if (error) {
    toast.error("ruby is not available!");
    return;
  }
  ({ output, error } = await runCommand("synvert-ruby", ["--version"]));
  if (error) {
    showErrorMesage("Synvert gem not found. Run `gem install synvert`.", "Install Now", () => installGem("synvert"));
    return;
  } else {
    const result = output.match(VERSION_REGEXP);
    const localSynvertVersion = result[1];
    const localSynvertCoreVersion = result[2];
    const response = await fetch(baseUrlByLanguage("ruby") + "/check-versions");
    const json = await response.json();
    const remoteSynvertVersion = json["synvert_version"];
    const remoteSynvertCoreVersion = json["synvert_core_version"];
    if (compareVersions(remoteSynvertVersion, localSynvertVersion) === 1) {
      showErrorMesage(
        `synvert gem version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`,
        "Update Now",
        () => installGem("synvert")
      );
    }
    if (compareVersions(remoteSynvertCoreVersion, localSynvertCoreVersion) === 1) {
      showErrorMesage(
        `synvert-core gem version ${remoteSynvertCoreVersion} is available. (Current Version: ${localSynvertCoreVersion})`,
        "Update Now",
        () => installGem("synvert-core")
      );
    }
  }
};

const checkJavascriptDependencies = async () => {
  if (!javascriptEnabled() && !typescriptEnabled() && !cssEnabled() && !lessEnabled() && !sassEnabled() && !scssEnabled()) {
    return;
  }
  let { output, error } = await runCommand("node", ["--version"]);
  if (error) {
    toast.error("nodejs is not available!");
    return;
  }
  ({ output, error } = await runCommand("synvert-javascript", ["--version"]));
  if (error) {
    showErrorMesage("Synvert npm not found. Run `npm install -g synvert`.", "Install Now", () => installNpm("synvert"));
    return;
  } else {
    // Install synvert-core globally doesn't make any sense
    const result = output.match(VERSION_REGEXP);
    const localSynvertVersion = result[1];
    // const localSynvertCoreVersion = result[2];
    const response = await fetch(baseUrlByLanguage("javascript") + "/check-versions");
    const json = await response.json();
    const remoteSynvertVersion = json["synvert_version"];
    // const remoteSynvertCoreVersion = json['synvert_core_version'];
    if (compareVersions(remoteSynvertVersion, localSynvertVersion) === 1) {
      showErrorMesage(
        `synvert npm version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`,
        "Update Now",
        () => installNpm("synvert")
      );
    }
    // if (compareVersions(remoteSynvertCoreVersion, localSynvertCoreVersion) === 1) {
    //   showErrorMesage(`synvert-core npm version ${remoteSynvertCoreVersion} is available. (Current Version: ${localSynvertCoreVersion})`, "Update Now", () => installNpm("synvert-core"));
    // }
  }
};

const checkDependencies = async () => {
  await checkRubyDependencies();
  await checkJavascriptDependencies();
};

const addFileSourceToTestResults = (testResults, rootPath) => {
  testResults.forEach((testResult) => {
    if (!isAddFileAction(testResult)) {
      const fileSource = window.electronAPI.readFile(window.electronAPI.pathJoin(rootPath, testResult.filePath));
      testResult.fileSource = fileSource;
    }
    testResult.rootPath = rootPath;
  });
};

const testSnippet = async (event) => {
  const { detail: { language, snippetCode, rootPath, onlyPaths, skipPaths } } = event;
  if (!languageEnabled(language)) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: `Synvert ${language} is not enabled!` });
    return;
  }
  const command = language === "ruby" ? "synvert-ruby" : "synvert-javascript";
  const commandArgs = buildCommandArgs("test", language, rootPath, onlyPaths, skipPaths);
  const { output, error } = await runCommand(command, commandArgs, { input: snippetCode });
  if (error) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error });
    return;
  }
  try {
    const testResults = parseJSON(output);
    addFileSourceToTestResults(testResults, rootPath);
    triggerEvent(EVENT_SNIPPET_TESTED, { testResults });
  } catch (e) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: e.message });
  }
};

const runSnippet = async (event) => {
  const {
    detail: { language, snippetCode, rootPath, onlyPaths, skipPaths } } = event;
  if (!languageEnabled(language)) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: `Synvert ${language} is not enabled!` });
    return;
  }
  const command = language === "ruby" ? "synvert-ruby" : "synvert-javascript";
  const commandArgs = buildCommandArgs("run", language, rootPath, onlyPaths, skipPaths);
  const { output, error } = await runCommand(command, commandArgs, { input: snippetCode });
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

const buildCommandArgs = (executeCommand, language, rootPath, onlyPaths, skipPaths) => {
  const commandArgs = ["--execute", executeCommand];
  if (executeCommand === "run") {
    commandArgs.push("--format");
    commandArgs.push("json");
  }
  if (onlyPaths.length > 0) {
    commandArgs.push("--only-paths");
    commandArgs.push(onlyPaths);
  }
  if (skipPaths.length > 0) {
    commandArgs.push("--skip-paths");
    commandArgs.push(skipPaths);
  }
  switch(language) {
    case "ruby":
      if (executeCommand === "test") {
        commandArgs.push("--number-of-workers");
        commandArgs.push(rubyNumberOfWorkers());
      }
      if (!rubySingleQuote()) {
        commandArgs.push("--double-quote");
      }
      commandArgs.push("--tab-width");
      commandArgs.push(rubyTabWidth());
      commandArgs.push(rootPath);
    case "javascript":
      commandArgs.push("--max-file-size");
      commandArgs.push(javascriptMaxFileSize() * 1024);
      if (javascriptSingleQuote()) {
        commandArgs.push("--single-quote");
      }
      if (!javascriptSemi()) {
        commandArgs.push("--no-semi");
      }
      commandArgs.push("--tab-width");
      commandArgs.push(javascriptTabWidth());
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
    case "typescript":
      commandArgs.push("--max-file-size");
      commandArgs.push(typescriptMaxFileSize() * 1024);
      if (typescriptSingleQuote()) {
        commandArgs.push("--single-quote");
      }
      if (!typescriptSemi()) {
        commandArgs.push("--no-semi");
      }
      commandArgs.push("--tab-width");
      commandArgs.push(typescriptTabWidth());
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
    case "css":
      commandArgs.push("--max-file-size");
      commandArgs.push(cssMaxFileSize() * 1024);
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
    case "less":
      commandArgs.push("--max-file-size");
      commandArgs.push(lessMaxFileSize() * 1024);
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
    case "sass":
      commandArgs.push("--max-file-size");
      commandArgs.push(sassMaxFileSize() * 1024);
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
    case "scss":
      commandArgs.push("--max-file-size");
      commandArgs.push(scssMaxFileSize() * 1024);
      commandArgs.push("--root-path");
      commandArgs.push(rootPath);
  }
  return commandArgs;
}

window.addEventListener(EVENT_TEST_SNIPPET, testSnippet);
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet);
// check dependencies after first inited.
window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies);

if (getInited()) {
  // check dependencies every time app starts
  setTimeout(checkDependencies, 100);
}
