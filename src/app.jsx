import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { dialog } = require('electron').remote

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import AppContext from './context'
import SnippetHeader from './components/SnippetHeader.jsx'
import ListSnippets from './components/ListSnippets.jsx'
import ShowSnippet from './components/ShowSnippet.jsx'
import { EVENT_DEPENDENCIES_CHECKED, EVENT_SNIPPETS_LOADED } from './constants'

const App = () => {
    const [error, setError] = useState('')
    const [path, setPath] = useState('')
    const [snippetsStore, setSnippetsStore] = useState({})
    const [currentSnippetId, setCurrentSnippetId] = useState(null)
    const [checked, setChecked] = useState(false)

    const selectPath = () => {
        const path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
        if (path) {
            setPath(path[0])
        }
    }

    const value = {
        path,
        snippetsStore,
        currentSnippetId,
    }

    useEffect(() => {
        document.addEventListener(EVENT_DEPENDENCIES_CHECKED, event => {
            const { error } = event.detail
            setError(error)
            setChecked(true)
        })
    })

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPETS_LOADED, event => {
            const { snippetsStore } = event.detail
            if (snippetsStore) {
                setSnippetsStore(snippetsStore)
            }
        })
    })

    useEffect(() => {
        if (Object.keys(snippetsStore).length > 0 && !currentSnippetId) {
            setCurrentSnippetId(Object.keys(snippetsStore).sort()[0])
        }
    })

    if (!checked) {
       return <div className="alert text-center">Checking dependencies...</div>
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>
    }

    return (
        <AppContext.Provider value={value}>
            <div className="d-flex flex-column">
                <SnippetHeader selectPath={selectPath} />
                <div className="d-flex flex-row flex-grow-1">
                    <div className="w-30 mr-4"><ListSnippets setCurrentSnippetId={setCurrentSnippetId} /></div>
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