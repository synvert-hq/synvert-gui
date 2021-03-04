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

const listSnippetsCommand = () => {
    if (dockerDependencySelected()) {
        return 'docker run xinminlabs/awesomecode-docker:latest synvert --list-all'
    } else {
        return 'synvert --list-all'
    }
}

const showSnippetCommand = (snippetId) => {
    if (dockerDependencySelected()) {
        return `docker run xinminlabs/awesomecode-docker:latest synvert --show ${snippetId}`
    } else {
        return `synvert --show ${snippetId}`
    }
}

const updateCommand = () => {
    if (dockerDependencySelected()) {
        return 'docker pull xinminlabs/awesomecode-docker:latest'
    } else {
        return 'gem install synvert synvert-core && synvert --sync'
    }
}

const runSnippetCommand = (snippetId, path) => {
    if (dockerDependencySelected()) {
        return `docker run -v ${path}:/app xinminlabs/awesomecode-docker:latest synvert --run ${snippetId} /app`
    } else {
        return `synvert --run ${snippetId} ${path}`
    }
}

const checkDependencies = async () => {
    let stdout, stderr
    if (dockerDependencySelected()) {
        ({ stdout, stderr } = await exec('docker -v'))
        if (stderr) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install docker first!' } })
            document.dispatchEvent(event)
            return
        }
        try {
            ({ stdout, stderr } = await exec('docker image inspect xinminlabs/awesomecode-docker'))
            if (!stderr) {
                document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
                return
            }
            ({ stdout, stderr } = await exec('docker pull xinminlabs/awesomecode-docker'))
            if (!stderr) {
                document.dispatchEvent(new Event(EVENT_DEPENDENCIES_CHECKED))
                return
            }
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install docker image xinminlabs/awesomecode-docker' } })
            document.dispatchEvent(event)
        } catch (e) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please start docker daemon' } })
            document.dispatchEvent(event)
        }
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
    const { stdout, stderr } = await exec(listSnippetsCommand())
    try {
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { snippetsStore } })
        document.dispatchEvent(event)
    } catch (e) {
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { error: 'Failed to sync snippets!' } })
        document.dispatchEvent(event)
    }
}

const update = async () => {
    await exec(updateCommand())
    document.dispatchEvent(new Event(EVENT_UPDATED))
}

const runSnippet = async (event) => {
    const { detail: { currentSnippetId, path } } = event
    await exec(runSnippetCommand(currentSnippetId, path))
    document.dispatchEvent(new Event(EVENT_SNIPPET_RUN))
}

const showSnippet = async (event) => {
    const { detail: { currentSnippetId } } = event
    const { stdout, stderr } = await exec(showSnippetCommand(currentSnippetId))
    document.dispatchEvent(new CustomEvent(EVENT_SNIPPET_SHOWN, { detail: { code: stdout } }))
}

document.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
document.addEventListener(EVENT_LOAD_SNIPPETS, loadSnippets)
document.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
document.addEventListener(EVENT_SHOW_SNIPPET, showSnippet)
document.addEventListener(EVENT_UPDATE, update)