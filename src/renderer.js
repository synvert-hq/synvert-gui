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
    EVENT_SHOW_SNIPPET,
    EVENT_SNIPPET_SHOWN,
    EVENT_UPDATE,
    EVENT_UPDATED,
    EVENT_CHECKING_DEPENDENCIES,
} from './constants';
import { triggerEvent, dockerDependencySelected, convertSnippetsToStore } from './utils'

const util = require('util')
const exec = util.promisify(require('child_process').exec)
require('fix-path')()

const runDockerCommand = async (command, { type, id, name } = {}) => {
    try {
        if (type) {
            await new Promise(resolve => setTimeout(resolve, 100));
            triggerEvent(type, { id, name, status: 'started' })
        }
        const { stdout, stderr } = await exec(command)
        if (type) {
            triggerEvent(type, { id, name, status: stderr ? 'failed' : 'done' })
        }
        return { result: true, stdout, stderr }
    } catch (e) {
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
    const { stdout, stderr } = await exec(command)
    if (type) {
        triggerEvent(type, { id, name, status: stderr ? 'failed' : 'done' })
    }
    return { stdout, stderr }
}

const checkDependencies = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ stdout, stderr } = await runCommand('docker -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking docker daemon...' }))
        if (stderr) {
            triggerEvent(EVENT_CHECKING_DEPENDENCIES, { error: 'Please install docker first!' })
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker image inspect xinminlabs/awesomecode-docker', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking docker image xinminlabs/awesomecode-docker...'}))
        if (!result) return
        if (!stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-docker', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Pulling docker image xinminlabs/awesomecode-docker...' }))
        if (!result) return
        if (!stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install docker image xinminlabs/awesomecode-docker' })
    } else {
        ({ stdout, stderr } = await runCommand('ruby -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking ruby version...' }))
        if (stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install ruby first!' })
            return
        }
        const rubyVersion = stdout
        ({ stdout, stderr } = await runCommand('synvert --version', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking synvert version...' }))
        if (stdout) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        ({ stdout, stderr } = await runCommand('gem install synvert', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Installing synvert gem...' }))
        if (!stderr) {
            triggerEvent(EVENT_DEPENDENCIES_CHECKED)
            return
        }
        triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: 'Please install synvert gem first in your ' + rubyVersion })
    }
}

const loadSnippets = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker run xinminlabs/awesomecode-docker synvert --list-all'))
    } else {
       ({ stdout, sterr } = await runCommand('synvert --list-all'))
    }
    if (!result) return
    try {
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        triggerEvent(EVENT_SNIPPETS_LOADED, { snippetsStore })
    } catch (e) {
        triggerEvent(EVENT_SNIPPETS_LOADED, { error: 'Failed to load snippets!' })
    }
}

const runSnippet = async (event) => {
    const { detail: { currentSnippetId, path } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-docker synvert --run ${currentSnippetId} /app`))
    } else {
        ({ stdout, stderr } = await runCommand(`synvert --run ${currentSnippetId} ${path}`))
    }
    if (!result) return
    triggerEvent(EVENT_SNIPPET_RUN)
}

const showSnippet = async (event) => {
    const { detail: { currentSnippetId } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run xinminlabs/awesomecode-docker synvert --show ${currentSnippetId}`))
    } else {
        ({ stdout, stderr } = await runCommand(`synvert --show ${currentSnippetId}`))
    }
    if (!result) return
    triggerEvent(EVENT_SNIPPET_SHOWN, { code: stdout })
}

const update = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-docker'))
    } else {
        ({ stdout, stderr } = await runCommand('gem install synvert synvert-core && synvert --sync'))
    }
    if (!result) return
    triggerEvent(EVENT_UPDATED)
}

window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
window.addEventListener(EVENT_LOAD_SNIPPETS, loadSnippets)
window.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
window.addEventListener(EVENT_SHOW_SNIPPET, showSnippet)
window.addEventListener(EVENT_UPDATE, update)