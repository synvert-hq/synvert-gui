import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import LoadingOverlay from 'react-loading-overlay'
import AppContext from '../context'
import Error from './Error.jsx'
import { EVENT_RUN_SNIPPET, EVENT_SNIPPET_RUN } from '../constants'

export default () => {
    const [error, setError] = useState('')
    const [running, setRunning] = useState(false)

    const { path, snippetsStore, currentSnippetId } = useContext(AppContext)

    useEffect(() => {
        Prism.highlightAll();
    })

    useEffect(() => {
        document.addEventListener(EVENT_SNIPPET_RUN, event => {
            if (event.detail.error) {
                setError(event.detail.error)
            } else {
                setError('')
            }
            setRunning(false)
        })
    })

    const run = (path, currentSnippetId) => {
        const event = new CustomEvent(EVENT_RUN_SNIPPET, { detail: { path, currentSnippetId } })
        document.dispatchEvent(event)
        setRunning(true)
    }

    if (!currentSnippetId) return null

    const snippet = snippetsStore[currentSnippetId]
    return (
        <LoadingOverlay active={running} spinner text='Running snippet...'>
            <div className="snippet-show">
                <Error error={error} />
                <button className="btn btn-primary float-right" disabled={!path} onClick={() => run(path, currentSnippetId)}>Run</button>
                <h2>{snippet.group}/{snippet.name}</h2>
                <div><ReactMarkdown children={snippet.description} /></div>
                <ul>
                    {snippet.sub_snippets.map(subSnippetName => {
                        const subSnippet = snippetsStore[`${snippet.group}/${subSnippetName}`]
                        return (
                            <li key={subSnippetName}>
                                <h4>{subSnippetName}</h4>
                                <div><ReactMarkdown children={subSnippet.description} /></div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </LoadingOverlay>
    )
}