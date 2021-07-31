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

import './index.css';
import './app.jsx';

import {
    EVENT_CHECK_DEPENDENCIES,
    EVENT_DEPENDENCIES_CHECKED,
    EVENT_LOAD_SNIPPETS,
    EVENT_SNIPPETS_LOADED,
    EVENT_RUN_SNIPPET,
    EVENT_SNIPPET_RUN,
    EVENT_EXECUTE_SNIPPET,
    EVENT_SHOW_SNIPPET,
    EVENT_SNIPPET_SHOWN,
    EVENT_CHECKING_DEPENDENCIES,
    EVENT_SHOW_SNIPPET_DIFF,
    EVENT_SNIPPET_DIFF_SHOWN,
    EVENT_COMMIT_DIFF,
    EVENT_DIFF_COMMITTED,
    EVENT_SYNC_SNIPPETS,
} from './constants';
import { log, triggerEvent, dockerDependencySelected, convertSnippetsToStore } from './utils'

const { ipcRenderer } = require('electron')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
require('fix-path')()

const isRealError = stderr => stderr && !stderr.startsWith('warning:')

const runDockerCommand = async (command, { type, id, name } = {}) => {
    if (type) {
        await new Promise(resolve => setTimeout(resolve, 100));
        triggerEvent(type, { id, name, status: 'started' })
    }
    try {
        log({ type: 'runDockerCommand', command })
        const { stdout, stderr } = await exec(command)
        log({ type: 'runDockerCommand', stdout, stderr })
        if (type) {
            triggerEvent(type, { id, name, status: isRealError(stderr) ? 'failed' : 'done' })
        }
        return { result: true, stdout, stderr: isRealError(stderr) ? stderr : null }
    } catch (e) {
        log({ type: 'runDockerCommand error', e })
        if (type) {
            triggerEvent(type, { id, name, status: 'failed' })
        }
        if (e.message.includes('Cannot connect to the Docker daemon')) {
            if (type) {
                triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please start docker daemon first!' })
            }
            return { result: false }
        }
        return { result: true, stdout: null, stderr: e.message }
    }
}

const runCommand = async (command, { type, id, name } = {}) => {
    if (type) {
        await new Promise(resolve => setTimeout(resolve, 100));
        triggerEvent(type, { id, name, status: 'started' })
    }
    try {
        log({ type: 'runCommand', command })
        const { stdout, stderr } = await exec(command)
        log({ type: 'runCommand', stdout, stderr })
        if (type) {
            triggerEvent(type, { id, name, status: isRealError(stderr) ? 'failed' : 'done' })
        }
        return { stdout, stderr: isRealError(stderr) ? stderr : null }
    } catch (e) {
        log({ type: 'runCommand error', e })
        if (type) {
            triggerEvent(type, { id, name, status: 'failed' })
        }
        return { stdout: null, stderr: e.message }
    }
}

const checkDependencies = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ stdout, stderr } = await runCommand('docker -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking docker daemon...' }))
        if (stderr) {
            triggerEvent(EVENT_CHECKING_DEPENDENCIES, { error: 'Please install docker first!' })
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker image inspect xinminlabs/awesomecode-synvert', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking docker image xinminlabs/awesomecode-synvert...'}))
        if (!result) return
        if (!stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-synvert', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Pulling docker image xinminlabs/awesomecode-synvert...' }))
        if (!result) return
        if (!stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install docker image xinminlabs/awesomecode-synvert' })
    } else {
        ({ stdout, stderr } = await runCommand('ruby -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking ruby version...' }))
        if (stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install ruby first!' })
            return
        }
        ({ stdout, stderr } = await runCommand('synvert --version', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking synvert version...' }))
        if (isRealError(stderr)) {
            ({ stdout, stderr } = await runCommand('gem install synvert', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Installing synvert gem...' }))
            if (stderr) {
                triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install synvert first!' })
                return
            }
        }
        ({ stdout, stderr } = await runCommand('test -d ~/.synvert/.git || exit 1', { type: EVENT_CHECKING_DEPENDENCIES, id: 4, name: 'Checking synvert snippets...'}))
        if (stderr) {
            ({ stdout, stderr } = await runCommand('synvert --sync', { type: EVENT_CHECKING_DEPENDENCIES, id: 5, name: 'Syncing synvert snippets...' }))
            if (isRealError(stderr)) {
                triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please sync synvert snippets first!' })
                return
            }
        }
        triggerEvent(EVENT_DEPENDENCIES_CHECKED)
    }
}

const loadSnippets = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker run xinminlabs/awesomecode-synvert synvert --list --format json'))
    } else {
       ({ stdout, stderr } = await runCommand('synvert --list --format json'))
    }
    if (!result) return
    try {
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        triggerEvent(EVENT_SNIPPETS_LOADED, { snippetsStore })
    } catch (e) {
        triggerEvent(EVENT_SNIPPETS_LOADED, { error: 'Failed to load snippets! Try sync snippets to fix it.' })
    }
}

const runSnippet = async (event) => {
    const { detail: { currentSnippetId, path } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-synvert synvert --run ${currentSnippetId} --format json /app`))
    } else {
        ({ stdout, stderr } = await runCommand(`synvert --run ${currentSnippetId} --format json ${path}`))
    }
    if (!result) return
    try {
        const output = JSON.parse(stdout)
        triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files, error: stderr })
    } catch(e) {
        triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to run snippet!' })
    }
}

const executeSnippet = async (event) => {
    const { detail: { newSnippet, path } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-synvert echo "${newSnippet}" | synvert --execute --format json /app`))
    } else {
        ({ stdout, stderr } = await runCommand(`echo "${newSnippet}" | synvert --execute --format json ${path}`))
    }
    if (!result) return
    try {
        const output = JSON.parse(stdout)
        triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files, error: stderr })
    } catch(e) {
        triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to run snippet!' })
    }
}

const showSnippet = async (event) => {
    const { detail: { currentSnippetId } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run xinminlabs/awesomecode-synvert synvert --show ${currentSnippetId}`))
    } else {
        ({ stdout, stderr } = await runCommand(`synvert --show ${currentSnippetId}`))
    }
    if (!result) return
    triggerEvent(EVENT_SNIPPET_SHOWN, { code: stdout, error: stderr })
}

const showSnippetDiff = async (event) => {
    const { detail: { path } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-synvert /bin/sh -c 'cd /app && git diff'`))
    } else {
        ({ stdout, stderr } = await runCommand(`cd ${path}; git diff`))
    }
    if (!result) return
    triggerEvent(EVENT_SNIPPET_DIFF_SHOWN, { diff: stdout, error: stderr })
}

const commitDiff = async (event) => {
    const { detail: { path, commitMessage } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app -v ~/.gitconfig:/etc/gitconfig xinminlabs/awesomecode-synvert /bin/sh -c 'cd /app && git add . && git commit -m "${commitMessage}" --no-verify'`))
    } else {
        ({ stdout, stderr } = await runCommand(`cd ${path} && git add . && git commit -m "${commitMessage}" --no-verify`))
    }
    if (!result) return
    triggerEvent(EVENT_DIFF_COMMITTED, { error: stderr })
}

const syncSnippets = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-synvert'))
    } else {
        ({ stdout, stderr } = await runCommand('gem install synvert && synvert --sync'))
    }
    if (!result) return
    return await loadSnippets()
}

window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
window.addEventListener(EVENT_LOAD_SNIPPETS, loadSnippets)
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
window.addEventListener(EVENT_EXECUTE_SNIPPET, executeSnippet)
window.addEventListener(EVENT_SHOW_SNIPPET, showSnippet)
window.addEventListener(EVENT_SHOW_SNIPPET_DIFF, showSnippetDiff)
window.addEventListener(EVENT_COMMIT_DIFF, commitDiff)
window.addEventListener(EVENT_SYNC_SNIPPETS, syncSnippets)

ipcRenderer.on(EVENT_SYNC_SNIPPETS, () => {
    triggerEvent(EVENT_SYNC_SNIPPETS)
})