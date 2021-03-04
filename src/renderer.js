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
} from './constants';
import { dockerDependencySelected, convertSnippetsToStore } from './utils'

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const runDockerCommand = async (command) => {
    try {
        const { stdout, stderr } = await exec(command)
        return { result: true, stdout, stderr }
    } catch (e) {
        if (e.message.includes('Cannot connect to the Docker daemon')) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please start docker daemon first!' } })
            document.dispatchEvent(event)
            return { result: false }
        }
        return { result: true, stdout: null, stderr: e.message }
    }
}

const checkDependencies = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ stdout, stderr } = await exec('docker -v'))
        if (stderr) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install docker first!' } })
            document.dispatchEvent(event)
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker image inspect xinminlabs/awesomecode-docker'))
        if (!result) return
        if (!stderr) {
            document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
            return
        }
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-docker'))
        if (!result) return
        if (!stderr) {
            document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
            return
        }
        const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install docker image xinminlabs/awesomecode-docker' } })
        document.dispatchEvent(event)
    } else {
        ({ stdout, stderr } = await exec('ruby -v'))
        if (stderr) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install ruby first!' } })
            document.dispatchEvent(event)
            return
        }
        const rubyVersion = stdout
        ({ stdout, stderr } = await exec('synvert --version'))
        if (stdout) {
            document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
            return
        }
        ({ stdout, stderr } = await exec('gem install synvert'))
        if (!stderr) {
            document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
            return
        }
        const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install synvert gem first in your ' + rubyVersion } })
        document.dispatchEvent(event)
    }
}

const loadSnippets = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker run xinminlabs/awesomecode-docker synvert --list-all'))
    } else {
       ({ stdout, sterr } = await exec('synvert --list-all'))
    }
    if (!result) return
    try {
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { snippetsStore } })
        document.dispatchEvent(event)
    } catch (e) {
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { error: 'Failed to load snippets!' } })
        document.dispatchEvent(event)
    }
}

const runSnippet = async (event) => {
    const { detail: { currentSnippetId, path } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-docker:latest synvert --run ${currentSnippetId} /app`))
    } else {
        ({ stdout, stderr } = await exec(`synvert --run ${currentSnippetId} ${path}`))
    }
    if (!result) return
    document.dispatchEvent(new Event(EVENT_SNIPPET_RUN))
}

const showSnippet = async (event) => {
    const { detail: { currentSnippetId } } = event
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand(`docker run xinminlabs/awesomecode-docker:latest synvert --show ${currentSnippetId}`))
    } else {
        ({ stdout, stderr } = await exec(`synvert --show ${currentSnippetId}`))
    }
    if (!result) return
    document.dispatchEvent(new CustomEvent(EVENT_SNIPPET_SHOWN, { detail: { code: stdout } }))
}

const update = async () => {
    let result = true, stdout, stderr
    if (dockerDependencySelected()) {
        ({ result, stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-docker:latest'))
    } else {
        ({ stdout, stderr } = await exec('gem install synvert synvert-core && synvert --sync'))
    }
    if (!result) return
    document.dispatchEvent(new Event(EVENT_UPDATED))
}

document.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
document.addEventListener(EVENT_LOAD_SNIPPETS, loadSnippets)
document.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
document.addEventListener(EVENT_SHOW_SNIPPET, showSnippet)
document.addEventListener(EVENT_UPDATE, update)