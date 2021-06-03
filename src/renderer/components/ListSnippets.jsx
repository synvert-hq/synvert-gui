import React, { useContext, useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import AppContext from '../context'
import Error from './Error'
import { triggerEvent, searchSnippets, sortSnippets } from '../utils'
import { EVENT_LOAD_SNIPPETS, EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS } from '../constants';

const snippetClassname = (snippet, currentSnippetId) =>
    currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId ? 'list-group-item active' : 'list-group-item'

export default () => {
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [syncing, setSyncing] = useState(false)

    const { currentSnippetId, snippetsStore, dispatch } = useContext(AppContext)

    useEffect(() => {
        setError(null)
    }, [currentSnippetId])

    useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { error } }) => {
        setError(error)
        setLoaded(true)
        setSyncing(false)
    })

    useEffect(() => {
        if (!loaded) {
            triggerEvent(EVENT_LOAD_SNIPPETS)
        }
    }, [loaded])

    if (!loaded) {
        return (
            <div className="text-center">Loading Snippets...</div>
        )
    }

    const syncSnippets = () => {
        setSyncing(true)
        triggerEvent(EVENT_SYNC_SNIPPETS)
    }

    const snippetClicked = (snippet) => {
        dispatch({ type: SET_CURRENT_SNIPPET_ID, currentSnippetId: `${snippet.group}/${snippet.name}` });
    }

    return (
        <div className="container-fluid">
            <Error error={error} />
            <div className="d-flex">
                <input className="flex-grow-1 form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="button" className="btn btn-primary btm-sm ml-2" onClick={syncSnippets} disabled={syncing}>{syncing ? 'Syncing...' : 'Sync'}</button>
            </div>
            <ul className="snippets-list list-group list-group-flush mt-2">
                {searchSnippets(sortSnippets(Object.values(snippetsStore)), searchTerm).map(snippet => (
                    <li role="button" className={snippetClassname(snippet, currentSnippetId)} key={`${snippet.group}/${snippet.name}`} onClick={() => snippetClicked(snippet)}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
