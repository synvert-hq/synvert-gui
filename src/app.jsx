import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import AppContext from './context'
import SnippetHeader from './components/SnippetHeader.jsx'
import ListSnippets from './components/ListSnippets.jsx'
import ShowSnippet from './components/ShowSnippet.jsx'
import { EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS, EVENT_RUN_SNIPPET } from './constants'

const App = () => {
    const [path, setPath] = useState('')
    const [snippetsStore, setSnippetsStore] = useState({})
    const [currentSnippetId, setCurrentSnippetId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const runSnippet = () => {
        const event = new CustomEvent(EVENT_RUN_SNIPPET, { detail: { path, currentSnippetId } })
        document.dispatchEvent(event)
    }
    const syncSnippets = () => {
        const event = new Event(EVENT_SYNC_SNIPPETS)
        document.dispatchEvent(event)
    }

    const value = {
        path,
        snippetsStore,
        currentSnippetId,
        searchTerm,
        setPath,
        setSnippetsStore,
        setCurrentSnippetId,
        setSearchTerm,
        syncSnippets,
        runSnippet,
    }

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPETS_LOADED, event => {
            const { snippetsStore } = event.detail
            setSnippetsStore(snippetsStore)
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
                <SnippetHeader />
                <div className="d-flex flex-row flex-grow-1">
                    <div className="w-30 mr-4"><ListSnippets /></div>
                    <div className="flex-grow-1"><ShowSnippet /></div>
                </div>
            </div>
        </AppContext.Provider>
    )
}

function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render();