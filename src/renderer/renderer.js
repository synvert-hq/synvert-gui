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
    EVENT_LOAD_SNIPPETS,
    EVENT_SNIPPETS_LOADED,
    EVENT_RUN_SNIPPET,
    EVENT_SNIPPET_RUN,
    EVENT_EXECUTE_SNIPPET,
    EVENT_EDIT_SNIPPET,
    EVENT_SNIPPET_EDIT,
    EVENT_SHOW_SNIPPET,
    EVENT_SNIPPET_SHOWN,
    EVENT_CHECKING_DEPENDENCIES,
    EVENT_SHOW_SNIPPET_DIFF,
    EVENT_SNIPPET_DIFF_SHOWN,
    EVENT_COMMIT_DIFF,
    EVENT_DIFF_COMMITTED,
    EVENT_SYNC_SNIPPETS,
} from './constants';
import { log, triggerEvent, convertSnippetsToStore } from './utils'

// import shellescape from 'shell-escape'
// import util from 'util'
// const exec = util.promisify(require('child_process').exec)
// require('fix-path')()

// const isRealError = stderr => stderr && !stderr.startsWith('warning:') && !stderr.startsWith('Cloning into ')

// const runDockerCommand = async (command, { type, id, name } = {}) => {
//     if (type) {
//         await new Promise(resolve => setTimeout(resolve, 100));
//         triggerEvent(type, { id, name, status: 'started' })
//     }
//     try {
//         log({ type: 'runDockerCommand', command })
//         const { stdout, stderr } = await exec(command)
//         log({ type: 'runDockerCommand', stdout, stderr })
//         if (type) {
//             triggerEvent(type, { id, name, status: isRealError(stderr) ? 'failed' : 'done' })
//         }
//         return { stdout, stderr: isRealError(stderr) ? stderr : null }
//     } catch (e) {
//         log({ type: 'runDockerCommand error', e })
//         if (type) {
//             triggerEvent(type, { id, name, status: 'failed' })
//         }
//         return { stdout: null, stderr: e.message }
//     }
// }

// const runCommand = async (command, { type, id, name } = {}) => {
//     if (type) {
//         await new Promise(resolve => setTimeout(resolve, 100));
//         triggerEvent(type, { id, name, status: 'started' })
//     }
//     try {
//         log({ type: 'runCommand', command })
//         const { stdout, stderr } = await exec(command)
//         log({ type: 'runCommand', stdout, stderr })
//         if (type) {
//             triggerEvent(type, { id, name, status: isRealError(stderr) ? 'failed' : 'done' })
//         }
//         return { stdout, stderr: isRealError(stderr) ? stderr : null }
//     } catch (e) {
//         log({ type: 'runCommand error', e })
//         if (type) {
//             triggerEvent(type, { id, name, status: 'failed' })
//         }
//         return { stdout: null, stderr: e.message }
//     }
// }

// const checkDependencies = async () => {
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runCommand('docker -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking docker daemon...' }))
//         if (stderr) {
//             triggerEvent(EVENT_CHECKING_DEPENDENCIES, { error: stderr })
//             return
//         }
//         ({ stdout, stderr } = await runDockerCommand('docker image inspect xinminlabs/awesomecode-synvert-ruby', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking docker image xinminlabs/awesomecode-synvert-ruby...'}))
//         if (!stderr) {
//             triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//             return
//         }
//         ({ stdout, stderr } = await runDockerCommand('docker pull xinminlabs/awesomecode-synvert-ruby', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Pulling docker image xinminlabs/awesomecode-synvert-ruby...' }))
//         if (!stderr) {
//             triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//             return
//         }
//         triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//     } else {
//         ({ stdout, stderr } = await runCommand('ruby -v', { type: EVENT_CHECKING_DEPENDENCIES, id: 1, name: 'Checking ruby version...' }))
//         if (stderr) {
//             triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//             return
//         }
//         ({ stdout, stderr } = await runCommand('synvert-ruby --version', { type: EVENT_CHECKING_DEPENDENCIES, id: 2, name: 'Checking synvert version...' }))
//         if (isRealError(stderr)) {
//             ({ stdout, stderr } = await runCommand('gem install synvert', { type: EVENT_CHECKING_DEPENDENCIES, id: 3, name: 'Installing synvert gem...' }))
//             if (stderr) {
//                 triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//                 return
//             }
//         }
//         ({ stdout, stderr } = await runCommand('test -d ~/.synvert-ruby/.git || exit 1', { type: EVENT_CHECKING_DEPENDENCIES, id: 4, name: 'Checking synvert snippets...'}))
//         if (stderr) {
//             ({ stdout, stderr } = await runCommand('synvert-ruby --sync', { type: EVENT_CHECKING_DEPENDENCIES, id: 5, name: 'Syncing synvert snippets...' }))
//             if (isRealError(stderr)) {
//                 triggerEvent(EVENT_DEPENDENCIES_CHECKED, { error: stderr })
//                 return
//             }
//         }
//         triggerEvent(EVENT_DEPENDENCIES_CHECKED)
//     }
// }

const loadSnippets = async () => {
    const { stdout, stderr } = await window.electronAPI.loadSnippets();
    if (stderr) {
        triggerEvent(EVENT_SNIPPETS_LOADED, { error: stderr })
        return
    }
    try {
        const snippets = JSON.parse(stdout)
        const snippetsStore = convertSnippetsToStore(snippets)
        triggerEvent(EVENT_SNIPPETS_LOADED, { snippetsStore })
    } catch (e) {
        triggerEvent(EVENT_SNIPPETS_LOADED, { error: e.message })
    }
}

// const runSnippet = async (event) => {
//     const { detail: { currentSnippetId, path } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-synvert-ruby synvert-ruby --run ${currentSnippetId} --format json /app`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`synvert-ruby --run ${currentSnippetId} --format json ${path}`))
//     }
//     if (stderr) {
//         triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to run snippet!' })
//         return
//     }
//     try {
//         const output = JSON.parse(stdout)
//         triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files })
//     } catch(e) {
//         triggerEvent(EVENT_SNIPPET_RUN, { error: e.message })
//     }
// }

// const echoExecuteSnippet = customSnippet => {
//     const executeSnippet = customSnippet.replace(/Synvert::Rewriter.new.*do/m, 'Synvert::Rewriter.execute do')
//      return shellescape(['echo', executeSnippet])
// }

// const executeSnippet = async (event) => {
//     const { detail: { customSnippet, path } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runDockerCommand(`${echoExecuteSnippet(customSnippet)} | docker run -i -v ${path}:/app xinminlabs/awesomecode-synvert-ruby synvert-ruby --execute --format json /app`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`${echoExecuteSnippet(customSnippet)} | synvert-ruby --execute --format json ${path}`))
//     }
//     if (stderr) {
//         triggerEvent(EVENT_SNIPPET_RUN, { error: 'Failed to execute snippet!' })
//         return
//     }
//     try {
//         const output = JSON.parse(stdout)
//         triggerEvent(EVENT_SNIPPET_RUN, { affectedFiles: output.affected_files })
//     } catch(e) {
//         triggerEvent(EVENT_SNIPPET_RUN, { error: e.message })
//     }
// }

// const showSnippet = async (event) => {
//     const { detail: { currentSnippetId } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runDockerCommand(`docker run xinminlabs/awesomecode-synvert-ruby synvert-ruby --show ${currentSnippetId}`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`synvert-ruby --show ${currentSnippetId}`))
//     }
//     triggerEvent(EVENT_SNIPPET_SHOWN, { code: stdout, error: stderr })
// }

// const editSnippet = async (event) => {
//     const { detail: { currentSnippetId } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runDockerCommand(`docker run xinminlabs/awesomecode-synvert-ruby synvert-ruby --show ${currentSnippetId}`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`synvert-ruby --show ${currentSnippetId}`))
//     }
//     triggerEvent(EVENT_SNIPPET_EDIT, { code: stdout, error: stderr })
// }

// const showSnippetDiff = async (event) => {
//     const { detail: { path } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         ({ stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app xinminlabs/awesomecode-synvert-ruby /bin/sh -c "cd /app && git add .; git diff --cached --ignore-space-at-eol; git reset ."`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`cd ${path}; git add .; git diff --cached --ignore-space-at-eol; git reset .`))
//     }
//     triggerEvent(EVENT_SNIPPET_DIFF_SHOWN, { diff: stdout, error: stderr })
// }

// const commitDiff = async (event) => {
//     const { detail: { path, commitMessage } } = event
//     let stdout, stderr
//     if (dockerDependencySelected()) {
//         let gitConfigPath = '~/.gitconfig'
//         if (process.platform === 'win32') {
//             gitConfigPath = '%USERPROFILE%\\.gitconfig'
//         }
//         ({ stdout, stderr } = await runDockerCommand(`docker run -v ${path}:/app -v ${gitConfigPath}:/etc/gitconfig xinminlabs/awesomecode-synvert-ruby /bin/sh -c "cd /app && git add . && git commit -m ${`\\"${commitMessage.replace(/"/g, '\\\\\\"')}\\"`} --no-verify"`))
//     } else {
//         ({ stdout, stderr } = await runCommand(`cd ${path} && git add . && git commit -m "${commitMessage.replace(/"/g, '\\"')}" --no-verify`))
//     }
//     triggerEvent(EVENT_DIFF_COMMITTED, { error: stderr })
// }

const syncSnippets = async () => {
    await window.electronAPI.syncSnippets()
    // ignore stderr, always load snippets
    await loadSnippets()
}

// window.addEventListener(EVENT_CHECK_DEPENDENCIES, checkDependencies)
window.addEventListener(EVENT_LOAD_SNIPPETS, loadSnippets)
// window.addEventListener(EVENT_RUN_SNIPPET, runSnippet)
// window.addEventListener(EVENT_EXECUTE_SNIPPET, executeSnippet)
// window.addEventListener(EVENT_EDIT_SNIPPET, editSnippet)
// window.addEventListener(EVENT_SHOW_SNIPPET, showSnippet)
// window.addEventListener(EVENT_SHOW_SNIPPET_DIFF, showSnippetDiff)
// window.addEventListener(EVENT_COMMIT_DIFF, commitDiff)

window.electronAPI.onSyncSnippets(syncSnippets);

// sync snippets every time app starts
setTimeout(syncSnippets, 1000)
