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

import { EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS, EVENT_RUN_SNIPPET, EVENT_SNIPPET_RUN, EVENT_DEPENDENCIES_CHECKED } from './constants';
import { convertSnippetsToStore } from './utils'

const { exec } = require('child_process')

const checkDependencies = () => {
    exec('ruby -v', (err, stdout, stderr) => {
        if (err && err.code > 0) {
            const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install ruby first!' } })
            document.dispatchEvent(event)
            return
        }

        exec('synvert --version', (err, stdout, stderr) => {
            if (err && err.code > 0) {
                const event = new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: { error: 'Please install synvert gem first!' } })
                document.dispatchEvent(event)
                return
            }

            document.dispatchEvent(new CustomEvent(EVENT_DEPENDENCIES_CHECKED, { detail: {} }))
            listSnippets()
        })
    })
}

const listSnippets = () => {
    exec('synvert --list-all', (err, stdout, stderr) => {
        if (err && err.code > 0) {
            const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { error: 'Failed to sync snippets!' } })
            document.dispatchEvent(event)
            return
        }
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { snippetsStore } })
        document.dispatchEvent(event)
    })
}

const syncSnippets = () => {
    exec('synvert --sync', (err, stdout, stderr) => {
        if (err && err.code > 0) {
            const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { error: 'Failed to sync snippets!' } })
            document.dispatchEvent(event)
            return
        }
        listSnippets()
    })
}

checkDependencies()

document.addEventListener(EVENT_SYNC_SNIPPETS, syncSnippets)

document.addEventListener(EVENT_RUN_SNIPPET, (event) => {
    const { currentSnippetId, path } = event.detail
    exec(`synvert -r ${currentSnippetId} ${path}`, (err, stdout, stderr) => {
        if (err && err.code > 0) {
            const event = new CustomEvent(EVENT_SNIPPET_RUN, { detail: { error: 'Failed to run this snippet!' } })
            document.dispatchEvent(event)
            return
        }
        const event = new CustomEvent(EVENT_SNIPPET_RUN, { detail: {} })
        document.dispatchEvent(event)
    })
})