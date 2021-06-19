import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useContext, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener'
import LoadingOverlay from 'react-loading-overlay'

import AppContext from '../context'
import ListSnippets from './ListSnippets'
import ShowSnippet from './ShowSnippet'
import RunSnippet from './RunSnippet'
import NewSnippet from './NewSnippet'
import SelectDependencies from './SelectDependencies'
import CheckDependency from './CheckDependency'
import Error from './Error'
import { EVENT_DEPENDENCIES_CHECKED, EVENT_NEW_SNIPPET, EVENT_SNIPPETS_LOADED, SET_ERROR } from '../constants'
import { SET_SNIPPETS_STORE, SET_CURRENT_SNIPPET_ID } from '../constants'
import { dependencySelected } from '../utils'

export default () => {
    const { snippetsStore, currentSnippetId, loading, dispatch } = useContext(AppContext)

    const [dependency, setDependency] = useState(dependencySelected())
    const [checked, setChecked] = useState(false)

    useEventListener(EVENT_DEPENDENCIES_CHECKED, ({ detail: { error } = {} }) => {
        if (error) {
            dispatch({ type: SET_ERROR, error })
        }
        setChecked(true)
    })

    useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { snippetsStore } = {} }) => {
        if (snippetsStore) {
            dispatch({ type: SET_SNIPPETS_STORE, snippetsStore })
        }
    })

    useEventListener(EVENT_NEW_SNIPPET, () => {
        dispatch({ type: SET_CURRENT_SNIPPET_ID, currentSnippetId: 'new' })
    })

    useEffect(() => {
        if (Object.keys(snippetsStore).length > 0 && !currentSnippetId) {
            dispatch({ type: SET_CURRENT_SNIPPET_ID, currentSnippetId: Object.keys(snippetsStore).sort()[0] })
        }
    })

    if (!dependency) {
        return <SelectDependencies setDependency={setDependency} />
    }

    if (!checked) {
        return <CheckDependency />
    }

    return (
        <LoadingOverlay active={loading} spinner>
            <div className="main-container d-flex flex-row">
                <Error />
                <div className="sidebar">
                    <ListSnippets />
                </div>
                <div className="flex-grow-1">
                    <div className="d-flex flex-column main-content">
                        {currentSnippetId === 'new' ? <NewSnippet /> : <ShowSnippet />}
                        <RunSnippet />
                    </div>
                </div>
            </div>
        </LoadingOverlay>
    )
}
