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

import './app.jsx';
import './index.css';

import React from "react";
import toast from 'react-hot-toast';
import { compare, compareVersions } from 'compare-versions';

import {
    EVENT_TEST_SNIPPET,
    EVENT_SNIPPET_TESTED,
    EVENT_RUN_SNIPPET,
    EVENT_SNIPPET_RUN,
} from './constants';
import { rubyNumberOfWorkers, log, parseJSON, triggerEvent, rubyEnabled, javascriptEnabled, baseUrlByLanguage, typescriptEnabled } from './utils'

const isRealError = stderr => stderr && !stderr.startsWith('warning:') && !stderr.startsWith('Cloning into ') &&
  !stderr.startsWith("error: pathspec '.' did not match any file(s) known to git")

const runRubyCommand = async (command, args, { input } = {}) => {
  try {
    log({ type: 'runCommand', command: [command].concat(args).join(' ') });
    const { stdout, stderr } = await window.electronAPI.runRubyCommand(command, args, input);
    log({ type: 'runCommand', stdout, stderr });
    return { stdout, stderr: isRealError(stderr) ? stderr : null };
  } catch (e) {
    log({ type: 'runCommand error', e });
    return { stderr: e.message };
  }
}

const runJavascriptCommand = async (command, args, { input } = {}) => {
  try {
    log({ type: 'runCommand', command: [command].concat(args).join(' ') });
    const { stdout, stderr } = await window.electronAPI.runJavascriptCommand(command, args, input);
    log({ type: 'runCommand', stdout, stderr });
    return { stdout, stderr: isRealError(stderr) ? stderr : null };
  } catch (e) {
    log({ type: 'runCommand error', e });
    return { stderr: e.message };
  }
}

const installGem = async (name) => {
  const { stdout, stderr } = await runRubyCommand('gem', ['install', name]);
  if (stderr) {
    toast.error(`Failed to install the ${name} gem. `) + stderr;
  } else {
    toast.success(`Successfully installed the ${name} gem.`);
  }
}

const installNpm = async (name) => {
  const { stdout, stderr } = await runJavascriptCommand('npm', ['install', '-g', name]);
  if (stderr) {
    toast.error(`Failed to install the ${name} gem.`) + stderr;
  } else {
    toast.success(`Successfully installed the ${name} gem.`);
  }
}

const showErrorMesage = (message, buttonTitle, buttonAction) => {
  toast((t) => (
    <div>
      <p>{message}</p>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary btn-sm" onClick={() => {
          buttonAction();
          toast.dismiss(t.id);
        }}>{buttonTitle}</button>
        <button className="btn btn-info btn-sm" onClick={() => toast.dismiss(t.id)}>Dismiss</button>
      </div>
    </div>
  ), { duration: Infinity });
}

const VERSION_REGEXP = /(\d+\.\d+\.\d+) \(with synvert-core (\d+\.\d+\.\d+)/;

const checkRubyDependencies = async () => {
  if (!rubyEnabled()) {
    return;
  }
  let { stdout, stderr } = await runRubyCommand('ruby', ['--version']);
  if (stderr) {
    toast.error("ruby is not available!");
    return;
  }
  ({ stdout, stderr } = await runRubyCommand('synvert-ruby', ['--version']));
  if (stderr) {
    showErrorMesage("Synvert gem not found. Run `gem install synvert` or update your Gemfile.", "Install Now", () => installGem("synvert"));
    return;
  } else {
    const result = stdout.match(VERSION_REGEXP);
    const localSynvertVersion = result[1];
    const localSynvertCoreVersion = result[2];
    const response = await fetch(baseUrlByLanguage("ruby") + "/check-versions");
    const json = await response.json();
    const remoteSynvertVersion = json['synvert_version'];
    const remoteSynvertCoreVersion = json['synvert_core_version'];
    if (compareVersions(remoteSynvertVersion, localSynvertVersion) === 1) {
      showErrorMesage(`synvert gem version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`, "Update Now", () => installGem("synvert"));
    }
    if (compareVersions(remoteSynvertCoreVersion, localSynvertCoreVersion) === 1) {
      showErrorMesage(`synvert-core gem version ${remoteSynvertCoreVersion} is available. (Current Version: ${localSynvertCoreVersion})`, "Update Now", () => installGem("synvert-core"));
    }
  }
}

const checkJavascriptDependencies = async () => {
  if (!javascriptEnabled() && !typescriptEnabled()) {
    return;
  }
  let { stdout, stderr } = await runJavascriptCommand('node', ['--version']);
  if (stderr) {
    toast.error("nodejs is not available!");
    return;
  }
  ({ stdout, stderr } = await runJavascriptCommand('synvert-javascript', ['--version']));
  if (stderr) {
    showErrorMesage("Synvert npm not found. Run `npm install -g synvert`.", "Install Now", () => installNpm("synvert"));
    return;
  } else {
    const result = stdout.match(VERSION_REGEXP);
    const localSynvertVersion = result[1];
    const localSynvertCoreVersion = result[2];
    const response = await fetch(baseUrlByLanguage("javascript") + "/check-versions");
    const json = await response.json();
    const remoteSynvertVersion = json['synvert_version'];
    const remoteSynvertCoreVersion = json['synvert_core_version'];
    if (compareVersions(remoteSynvertVersion, localSynvertVersion) === 1) {
      showErrorMesage(`synvert npm version ${remoteSynvertVersion} is available. (Current version: ${localSynvertVersion})`, "Update Now", () => installNpm("synvert"));
    }
    if (compareVersions(remoteSynvertCoreVersion, localSynvertCoreVersion) === 1) {
      showErrorMesage(`synvert-core npm version ${remoteSynvertCoreVersion} is available. (Current Version: ${localSynvertCoreVersion})`, "Update Now", () => installNpm("synvert-core"));
    }
  }
}

const checkDependencies = async () => {
  await checkRubyDependencies();
  await checkJavascriptDependencies();
}

const addFileSourceToTestResults = (testResults, rootPath) => {
    testResults.forEach((testResult) => {
        const fileSource = window.electronAPI.readFile(window.electronAPI.pathJoin(rootPath, testResult.filePath));
        testResult.fileSource = fileSource;
        testResult.rootPath = rootPath;
    });
}

const testRubySnippet = async (event) => {
  if (!rubyEnabled()) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: "Synvert ruby is not enabled!" });
    return;
  }
  const { detail: { snippetCode, rootPath, onlyPaths, skipPaths } } = event
  const commandArgs = ["--execute", "test"];
  if (onlyPaths.length > 0) {
    commandArgs.push("--only-paths");
    commandArgs.push(onlyPaths);
  }
  if (skipPaths.length > 0) {
    commandArgs.push("--skip-paths")
    commandArgs.push(skipPaths);
  }
  if (rubyNumberOfWorkers()) {
    commandArgs.push("--number-of-workers");
    commandArgs.push(rubyNumberOfWorkers());
  }
  commandArgs.push(rootPath);
  const { stdout, stderr } = await runRubyCommand('synvert-ruby', commandArgs, { input: snippetCode });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: 'Failed to run snippet!' })
    return;
  }
  try {
    const testResults = parseJSON(stdout)
    addFileSourceToTestResults(testResults, rootPath);
    triggerEvent(EVENT_SNIPPET_TESTED, { testResults })
  } catch(e) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: e.message })
  }
}

const testJavascriptSnippet = async (event) => {
  if (!javascriptEnabled() && !typescriptEnabled()) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: "Synvert javascript is not enabled!" });
    return;
  }
  const { detail: { snippetCode, rootPath, onlyPaths, skipPaths } } = event
  const commandArgs = ["--execute", "test"];
  if (onlyPaths.length > 0) {
    commandArgs.push("--onlyPaths");
    commandArgs.push(onlyPaths);
  }
  if (skipPaths.length > 0) {
    commandArgs.push("--skipPaths");
    commandArgs.push(skipPaths);
  }
  commandArgs.push("--rootPath");
  commandArgs.push(rootPath);
  const { stdout, stderr } = await runJavascriptCommand('synvert-javascript', commandArgs, { input: snippetCode });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: 'Failed to run snippet!' })
    return;
  }
  try {
    const testResults = parseJSON(stdout)
    addFileSourceToTestResults(testResults, rootPath);
    triggerEvent(EVENT_SNIPPET_TESTED, { testResults })
  } catch(e) {
    triggerEvent(EVENT_SNIPPET_TESTED, { error: e.message })
  }
}

const testSnippet = async (event) => {
  const { detail: { language } } = event;
  if (language === "ruby") {
    await testRubySnippet(event);
  } else {
    await testJavascriptSnippet(event);
  }
}

const runRubySnippet = async (event) => {
  if (!rubyEnabled()) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: "Synvert ruby is not enabled!" });
    return;
  }
  const { detail: { snippetCode, rootPath, onlyPaths, skipPaths } } = event
  const commandArgs = ["--execute", "run", "--format", "json"];
  if (onlyPaths.length > 0) {
    commandArgs.push("--only-paths");
    commandArgs.push(onlyPaths);
  }
  if (skipPaths.length > 0) {
    commandArgs.push("--skip-paths");
    commandArgs.push(skipPaths);
  }
  commandArgs.push(rootPath);
  const { stdout, stderr } = await runRubyCommand('synvert-ruby', commandArgs, { input: snippetCode });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to run snippet!' })
    return
  }
  try {
    const output = JSON.parse(stdout)
    triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files })
  } catch(e) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: e.message })
  }
}

const runJavascriptSnippet = async (event) => {
  if (!javascriptEnabled() && !typescriptEnabled()) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: "Synvert javascript is not enabled!" });
    return;
  }
  const { detail: { snippetCode, rootPath, onlyPaths, skipPaths } } = event
  const commandArgs = ["--execute", "run", "--format", "json"];
  if (onlyPaths.length > 0) {
    commandArgs.push("--onlyPaths");
    commandArgs.push(onlyPaths);
  }
  if (skipPaths.length > 0) {
    commandArgs.push("--skipPaths");
    commandArgs.push(skipPaths);
  }
  commandArgs.push("--rootPath");
  commandArgs.push(rootPath);
  const { stdout, stderr } = await runJavascriptCommand('synvert-javascript', commandArgs, { input: snippetCode });
  if (stderr) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to run snippet!' })
    return
  }
  try {
    const output = JSON.parse(stdout)
    triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files })
  } catch(e) {
    triggerEvent(EVENT_SNIPPET_RUN, { error: e.message })
  }
}

const runSnippet = async (event) => {
  const { detail: { language } } = event;
  if (language === "ruby") {
    await runRubySnippet(event);
  } else {
    await runJavascriptSnippet(event);
  }
}

window.addEventListener(EVENT_TEST_SNIPPET, testSnippet)
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet)

// check dependencies every time app starts
setTimeout(checkDependencies, 100)
