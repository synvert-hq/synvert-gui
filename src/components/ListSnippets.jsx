import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context'
import Error from './Error'
import { searchSnippets, sortSnippets } from '../utils'
import { EVENT_LOAD_SNIPPETS, EVENT_SNIPPETS_LOADED } from '../constants';

const snippetClassname = (snippet, currentSnippetId) =>
    currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId ? 'list-group-item active' : 'list-group-item'

export default ({ setCurrentSnippetId }) => {
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [loaded, setLoaded] = useState(false)

    const { currentSnippetId, snippetsStore } = useContext(AppContext)

    useEffect(() => {
        setError('')
    }, [currentSnippetId])

    useEffect(() => {
        const listener = document.addEventListener(EVENT_SNIPPETS_LOADED, event => {
            const { detail: { error = '' } } = event
            setError(error)
            setLoaded(true)
        })
        return () => {
            document.removeEventListener(EVENT_SNIPPETS_LOADED, listener)
        }
    }, [])

    useEffect(() => {
        if (!loaded) {
            document.dispatchEvent(new Event(EVENT_LOAD_SNIPPETS))
        }
    }, [loaded])

    if (!loaded) {
        return (
            <div className="ml-5 mr-5">Loading Snippets...</div>
        )
    }

    return (
        <>
            <Error error={error} />
            <input className="form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
            <ul className="snippets-list list-group list-group-flush mt-2">
                {searchSnippets(sortSnippets(Object.values(snippetsStore)), searchTerm).map(snippet => (
                    <li role="button" className={snippetClassname(snippet, currentSnippetId)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippetId(`${snippet.group}/${snippet.name}`)}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        </>
    )
}
