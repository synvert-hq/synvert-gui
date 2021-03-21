import React, { useContext, useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import AppContext from '../context'
import Error from './Error'
import { triggerEvent, searchSnippets, sortSnippets } from '../utils'
import { EVENT_LOAD_SNIPPETS, EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS } from '../constants';

const snippetClassname = (snippet, currentSnippetId) =>
    currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId ? 'list-group-item active' : 'list-group-item'

export default ({ setCurrentSnippetId }) => {
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [syncing, setSyncing] = useState(false)

    const { currentSnippetId, snippetsStore } = useContext(AppContext)

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
            <div className="ml-5 mr-5">Loading Snippets...</div>
        )
    }

    const sync = () => {
        setSyncing(true)
        triggerEvent(EVENT_SYNC_SNIPPETS)
    }

    return (
        <div className="container-fluid">
            <Error error={error} />
            <div className="d-flex">
                <input className="flex-grow-1 form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="button" className="btn btn-primary btm-sm ml-2" onClick={sync} disabled={syncing}>{syncing ? 'Syncing...' : 'Sync'}</button>
            </div>
            <ul className="snippets-list list-group list-group-flush mt-2">
                {searchSnippets(sortSnippets(Object.values(snippetsStore)), searchTerm).map(snippet => (
                    <li role="button" className={snippetClassname(snippet, currentSnippetId)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippetId(`${snippet.group}/${snippet.name}`)}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
