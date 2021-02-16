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

const { exec } = require('child_process')

const compareSnippets = (a, b) => {
    if (`${a.group}/${a.name}` < `${b.group}/${b.name}`) return -1
    if (`${a.group}/${a.name}` > `${b.group}/${b.name}`) return 1
    return 0
}

// check ruby
// check synvert gem
// check synvert gem version
const syncSnippets = () => {
    exec('synvert --list-all', (err, stdout, stderr) => {
        const snippets = JSON.parse(stdout).sort(compareSnippets)
        const event = new CustomEvent(EVENT_SNIPPETS_LOADED, { detail: { snippets } })
        document.dispatchEvent(event)
    })
}
syncSnippets()

document.addEventListener(EVENT_SYNC_SNIPPETS, syncSnippets)

document.addEventListener(EVENT_RUN_SNIPPET, (event) => {
    const { currentSnippet, path } = event.detail
    exec(`synvert -r ${currentSnippet.group}/${currentSnippet.name} ${path}`, (err, stdout, stderr) => {
        // check result
        console.log(err, stdout, stderr)
    })
})