import LoadingOverlay from 'react-loading-overlay';
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context'
import Error from './Error.jsx'
import { searchSnippets, sortSnippets } from '../utils'
import { EVENT_SNIPPETS_LOADED, EVENT_SYNC_SNIPPETS } from '../constants';

const snippetClassname = (snippet, currentSnippetId) =>
    currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId ? 'list-group-item active' : 'list-group-item'

export default ({ setCurrentSnippetId }) => {
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [syncing, setSyncing] = useState(false)

    const { currentSnippetId, snippetsStore } = useContext(AppContext)

    useEffect(() => {
        setError('')
    }, [currentSnippetId])

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPETS_LOADED, event => {
            if (event.detail.error) {
                setError(event.detail.error)
            } else {
                setError('')
            }
            setSyncing(false)
        })
    })

    const sync = () => {
        const event = new Event(EVENT_SYNC_SNIPPETS)
        document.dispatchEvent(event)
        setSyncing(true)
    }

    if (Object.keys(snippetsStore).length === 0) {
        return (
            <div className="ml-5 mr-5">Loading Snippets...</div>
        )
    }

    return (
        <LoadingOverlay active={syncing} spinner text='Syncing snippets...'>
            <Error error={error} />
            <div className="d-flex">
                <input className="flex-grow-1 form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="button" className="btn btn-primary btn-sm ml-2" onClick={sync}>Sync</button>
            </div>
            <ul className="snippets-list list-group list-group-flush mt-2">
                {searchSnippets(sortSnippets(Object.values(snippetsStore)), searchTerm).map(snippet => (
                    <li role="button" className={snippetClassname(snippet, currentSnippetId)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippetId(`${snippet.group}/${snippet.name}`)}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        </LoadingOverlay>
    )
}