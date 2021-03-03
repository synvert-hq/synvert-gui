import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import LoadingOverlay from 'react-loading-overlay'
import AppContext from '../context'
import Error from './Error'
import { EVENT_RUN_SNIPPET, EVENT_SHOW_SNIPPET, EVENT_SNIPPET_RUN, EVENT_SNIPPET_SHOWN } from '../constants'

export default () => {
    const [error, setError] = useState('')
    const [running, setRunning] = useState(false)
    const [code, setCode] = useState('')
    const [showCode, setShowCode] = useState(false)

    const { path, snippetsStore, currentSnippetId } = useContext(AppContext)

    useEffect(() => {
        Prism.highlightAll();
    })

    useEffect(() => {
        setCode('')
    }, [currentSnippetId])

    useEffect(() => {
        const listener = document.addEventListener(EVENT_SNIPPET_RUN, () => {
            setError(error)
            setRunning(false)
        })
        return () => {
            document.removeEventListener(EVENT_SNIPPET_RUN, listener)
        }
    }, [])

    useEffect(() => {
        const listener = document.addEventListener(EVENT_SNIPPET_SHOWN, event => {
            const { detail: { code } } = event
            setCode(code)
        })
        return () => {
            document.removeEventListener(EVENT_SNIPPET_SHOWN, listener)
        }
    }, [])

    const run = () => {
        const event = new CustomEvent(EVENT_RUN_SNIPPET, { detail: { path, currentSnippetId } })
        document.dispatchEvent(event)
        setRunning(true)
    }

    const show = () => {
        if (code === '') {
            const event = new CustomEvent(EVENT_SHOW_SNIPPET, { detail: { currentSnippetId } })
            document.dispatchEvent(event)
        }
        setShowCode(true)
    }

    const close = () => {
        setShowCode(false)
    }

    if (!currentSnippetId) return null

    const snippet = snippetsStore[currentSnippetId]
    return (
        <LoadingOverlay active={running} spinner text='Running snippet...'>
            <div className="snippet-show">
                <Error error={error} />
                <button className="btn btn-primary float-right" disabled={!path} onClick={run}>Run</button>
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
                <button className="btn btn-primary float-right" onClick={show}>Show Source Code</button>
            </div>
            {showCode && (
                <div className="modal fade show" data-backdrop="static" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{snippet.group}/{snippet.name}</h5>
                                <button type="button" className="close" onClick={close}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {code === '' ? 'Loading...' : (
                                    <pre className="language-ruby"><code className="language-ruby">{code}</code></pre>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </LoadingOverlay>
    )
}