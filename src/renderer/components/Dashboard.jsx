import 'bootstrap/dist/css/bootstrap.min.css';

const { dialog } = require('electron').remote

import React, { useContext, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener'

import AppContext from '../context'
import SnippetHeader from './SnippetHeader'
import ListSnippets from './ListSnippets'
import ShowSnippet from './ShowSnippet'
import SelectDependencies from './SelectDependencies'
import CheckDependency from './CheckDependency'
import Error from './Error'
import { EVENT_DEPENDENCIES_CHECKED, EVENT_SNIPPETS_LOADED, EVENT_SNIPPET_RUN } from '../constants'
import { SET_PATH, SET_SNIPPETS_STORE, SET_CURRENT_SNIPPET_ID } from '../constants'
import { dependencySelected } from '../utils'

export default () => {
    const { snippetsStore, currentSnippetId, dispatch } = useContext(AppContext)

    const [dependency, setDependency] = useState(dependencySelected())
    const [error, setError] = useState(null)
    const [checked, setChecked] = useState(false)

    const selectPath = () => {
        const paths = dialog.showOpenDialogSync({
            properties: ['openDirectory', 'openFile']
        });
        if (paths) {
            dispatch({ type: SET_PATH, path: paths[0] });
            localStorage.setItem('path', paths[0]);
        }
    }

    useEventListener(EVENT_DEPENDENCIES_CHECKED, ({ detail: { error } = {} }) => {
        setError(error)
        setChecked(true)
    })

    useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { snippetsStore } = {} }) => {
        if (snippetsStore) {
            dispatch({ type: SET_SNIPPETS_STORE, snippetsStore })
        }
    })

    useEventListener(EVENT_SNIPPET_RUN, ({ detail: { snippetId, output } = {} }) => {
        snippetsStore[snippetId].affected_files = output.affected_files
        dispatch({ type: SET_SNIPPETS_STORE, snippetsStore })
    })

    useEffect(() => {
        if (Object.keys(snippetsStore).length > 0 && !currentSnippetId) {
            dispatch({ type: SET_CURRENT_SNIPPET_ID, currentSnippetId: Object.keys(snippetsStore).sort()[0] })
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
        <div className="d-flex flex-row flex-grow-1">
            <div className="sidebar">
                <ListSnippets />
            </div>
            <div className="flex-grow-1">
                <div className="d-flex flex-column">
                    <SnippetHeader selectPath={selectPath} />
                    <ShowSnippet />
                </div>
            </div>
        </div>
    )
}
