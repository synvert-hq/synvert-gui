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

import { EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS, EVENT_RUN_SNIPPET } from './constants';
import { convertSnippetsToStore } from './utils'

const { exec } = require('child_process')

// check ruby
// check synvert gem
// check synvert gem version
const listSnippets = () => {
    exec('synvert --list-all', (err, stdout, stderr) => {
        console.log(err, stdout, stderr)
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { snippetsStore } })
        document.dispatchEvent(event)
    })
}
listSnippets()

const syncSnippets = () => {
    exec('synvert --sync', (err, stdout, stderr) => {
        console.log(err, stdout, stderr)
        listSnippets()
    })
}

document.addEventListener(EVENT_SYNC_SNIPPETS, syncSnippets)

document.addEventListener(EVENT_RUN_SNIPPET, (event) => {
    const { snippetsStore, currentSnippetId, path } = event.detail
    const snippet = snippetsStore[currentSnippetId]
    exec(`synvert -r ${snippet.group}/${snippet.name} ${path}`, (err, stdout, stderr) => {
        // check result
        console.log(err, stdout, stderr)
    })
})