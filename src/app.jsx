import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { dialog } = require('electron').remote

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import AppContext from './context'
import SnippetHeader from './components/SnippetHeader.jsx'
import ListSnippets from './components/ListSnippets.jsx'
import ShowSnippet from './components/ShowSnippet.jsx'
import { EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS, EVENT_RUN_SNIPPET, EVENT_SNIPPET_RUN } from './constants'

const App = () => {
    const [path, setPath] = useState('')
    const [snippetsStore, setSnippetsStore] = useState({})
    const [currentSnippetId, setCurrentSnippetId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [syncing, setSyncing] = useState(false)
    const [running, setRunning] = useState(false)

    const selectPath = () => {
        const path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
        if (path) {
            setPath(path[0])
        }
    }

    const runSnippet = () => {
        const event = new CustomEvent(EVENT_RUN_SNIPPET, { detail: { path, currentSnippetId } })
        document.dispatchEvent(event)
        setRunning(true)
    }
    const syncSnippets = () => {
        const event = new Event(EVENT_SYNC_SNIPPETS)
        document.dispatchEvent(event)
        setSyncing(true)
    }

    const value = {
        path,
        snippetsStore,
        currentSnippetId,
        searchTerm,
        syncing,
        running,
    }

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPETS_LOADED, event => {
            const { snippetsStore } = event.detail
            setSnippetsStore(snippetsStore)
            setSyncing(false)
        })
    })

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPET_RUN, event => {
            setRunning(false)
        })
    })

    useEffect(() => {
        if (Object.keys(snippetsStore).length > 0 && !currentSnippetId) {
            setCurrentSnippetId(Object.keys(snippetsStore).sort()[0])
        }
    })

    return (
        <AppContext.Provider value={value}>
            <div className="d-flex flex-column">
                <SnippetHeader selectPath={selectPath} />
                <div className="d-flex flex-row flex-grow-1">
                    <div className="w-30 mr-4"><ListSnippets setSearchTerm={setSearchTerm} setCurrentSnippetId={setCurrentSnippetId} syncSnippets={syncSnippets} /></div>
                    <div className="flex-grow-1"><ShowSnippet runSnippet={runSnippet} /></div>
                </div>
            </div>
        </AppContext.Provider>
    )
}

function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render();