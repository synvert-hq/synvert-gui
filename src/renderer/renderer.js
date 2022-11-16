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

import {
    EVENT_CHECK_DEPENDENCIES,
    EVENT_DEPENDENCIES_CHECKED,
    EVENT_RUN_SNIPPET,
    EVENT_SNIPPET_RUN,
    EVENT_EXECUTE_SNIPPET,
    EVENT_CHECKING_DEPENDENCIES,
    EVENT_SHOW_SNIPPET_DIFF,
    EVENT_SNIPPET_DIFF_SHOWN,
    EVENT_COMMIT_DIFF,
    EVENT_DIFF_COMMITTED,
} from './constants';
import { log, triggerEvent } from './utils'

const isRealError = stderr => stderr && !stderr.startsWith('warning:') && !stderr.startsWith('Cloning into ') &&
  !stderr.startsWith("error: pathspec '.' did not match any file(s) known to git")

const runRubyCommand = async (command, args, { input, type, id, name } = {}) => {
    if (type) {
        await new Promise(resolve => setTimeout(resolve, 100));
        triggerEvent(type, { id, name, status: 'started' });
    }
    try {
        log({ type: 'runCommand', command: [command].concat(args).join(' ') });
        const { stdout, stderr } = await window.electronAPI.runRubyCommand(command, args, input);
        log({ type: 'runCommand', stdout, stderr });
        if (type) {
            triggerEvent(type, { id, name, status: isRealError(stderr) ? 'failed' : 'done' });
        }
        return { stdout, stderr: isRealError(stderr) ? stderr : null };
    } catch (e) {
        log({ type: 'runCommand error', e });
        if (type) {
            triggerEvent(type, { id, name, status: 'failed' });
        }
        return { stdout: null, stderr: e.message };
    }
}

const checkDependencies = async () => {
    let { stdout, stderr } = await runRubyCommand('ruby', ['--version'], { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking ruby version...' });
    if (stderr) {
        triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
        return
    }
    ({ stdout, stderr } = await runRubyCommand('synvert-ruby', ['--version'], { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking synvert version...' }))
    if (isRealError(stderr)) {
        ({ stdout, stderr } = await runRubyCommand('gem', ['install', 'synvert'], { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Installing synvert gem...' }))
        if (stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
            return
        }
    }
    ({ stdout, stderr } = await runRubyCommand('synvert-ruby', ['--sync'], { type: EVENT_CHECKING_DEPENDENCIES, id: 5, name: 'Syncing synvert snippets...' }))
    if (isRealError(stderr)) {
        triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
        return
    }
    triggerEvent(EVENT_DEPENDENCIES_CHECKED)
}

const runSnippet = async (event) => {
    const { detail: { currentSnippetId, path } } = event
    const { stdout, stderr } = await runRubyCommand('synvert-ruby', ['--run', currentSnippetId, '--format', 'json', path]);
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

const executeSnippet = async (event) => {
    const { detail: { customSnippet, path } } = event
    const { stdout, stderr } = await runRubyCommand('synvert-ruby', ['--execute', 'run', '--format', 'json', path], { input: customSnippet });
    if (stderr) {
        triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to execute snippet!' })
        return
    }
    try {
        const output = JSON.parse(stdout)
        triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files })
    } catch(e) {
        triggerEvent(EVENT_SNIPPET_RUN, { error: e.message })
    }
}

const showSnippetDiff = async (event) => {
    const { detail: { path } } = event
    const { stdout, stderr } = await window.electronAPI.runCommand(`cd ${path}; git add .; git diff --cached --ignore-space-at-eol; git reset .`);
    triggerEvent(EVENT_SNIPPET_DIFF_SHOWN, { diff: stdout, error: stderr })
}

const commitDiff = async (event) => {
    const { detail: { path, commitMessage } } = event
    const { stdout, stderr } = await window.electronAPI.runCommand(`cd ${path} && git add . && git commit -m "${commitMessage.replace(/"/g, '\\"')}" --no-verify`);
    triggerEvent(EVENT_DIFF_COMMITTED, { error: stderr })
}

const syncSnippets = async () => {
    await runRubyCommand('synvert-ruby', ['--sync']);
}

window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
window.addEventListener(EVENT_EXECUTE_SNIPPET, executeSnippet)
window.addEventListener(EVENT_SHOW_SNIPPET_DIFF, showSnippetDiff)
window.addEventListener(EVENT_COMMIT_DIFF, commitDiff)

window.electronAPI.onSyncSnippets(syncSnippets);

// sync snippets every time app starts
setTimeout(syncSnippets, 1000)
