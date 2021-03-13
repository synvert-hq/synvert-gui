import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { dialog } = require('electron').remote

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import useEventListener from '@use-it/event-listener'

import AppContext from './context'
import SnippetHeader from './components/SnippetHeader'
import ListSnippets from './components/ListSnippets'
import ShowSnippet from './components/ShowSnippet'
import SelectDependencies from './components/SelectDependencies'
import CheckDependency from './components/CheckDependency'
import Error from './components/Error'
import { EVENT_DEPENDENCIES_CHECKED, EVENT_SNIPPETS_LOADED, EVENT_SNIPPET_RUN } from './constants'
import { dependencySelected } from './utils'

const App = () => {
    const [dependency, setDependency] = useState(dependencySelected())
    const [error, setError] = useState(null)
    const [path, setPath] = useState(localStorage.getItem('path') || '')
    const [snippetsStore, setSnippetsStore] = useState({})
    const [currentSnippetId, setCurrentSnippetId] = useState(null)
    const [checked, setChecked] = useState(false)

    const selectPath = () => {
        const path = dialog.showOpenDialogSync({
            properties: ['openDirectory', 'openFile']
        });
        if (path) {
            setPath(path[0])
            localStorage.setItem('path', path[0])
        }
    }

    const value = {
        path,
        snippetsStore,
        currentSnippetId,
    }

    useEventListener(EVENT_DEPENDENCIES_CHECKED, ({ detail: { error } = {} }) => {
        setError(error)
        setChecked(true)
    })

    useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { snippetsStore } = {} }) => {
        if (snippetsStore) {
            setSnippetsStore(snippetsStore)
        }
    })

    useEventListener(EVENT_SNIPPET_RUN, ({ detail: { snippetId, output } = {} }) => {
        const store = snippetsStore
        store[snippetId].affected_files = output.affected_files
        setSnippetsStore(store)
    })

    useEffect(() => {
        if (Object.keys(snippetsStore).length > 0 && !currentSnippetId) {
            setCurrentSnippetId(Object.keys(snippetsStore).sort()[0])
        }
    })

    if (!dependency) {
        return <SelectDependencies setDependency={setDependency} />
    }

    if (error) {
        return <Error error={error} />
    }

    if (!checked) {
        return <CheckDependency />
    }

    return (
        <AppContext.Provider value={value}>
            <div className="d-flex flex-column">
                <SnippetHeader selectPath={selectPath} />
                <div className="d-flex flex-row flex-grow-1">
                    <div className="w-30"><ListSnippets setCurrentSnippetId={setCurrentSnippetId} /></div>
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