import React, { useContext, useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import LoadingOverlay from 'react-loading-overlay'
import AppContext from '../context'
import { EVENT_RUN_SNIPPET, EVENT_SHOW_SNIPPET, EVENT_SNIPPET_RUN, EVENT_SNIPPET_SHOWN } from '../constants'
import { triggerEvent } from '../utils'

export default () => {
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

    useEventListener(EVENT_SNIPPET_RUN, () => {
        setRunning(false)
    })

    useEventListener(EVENT_SNIPPET_SHOWN, ({ detail: { code }}) => {
        setCode(code)
    })

    const run = () => {
        triggerEvent(EVENT_RUN_SNIPPET, { path, currentSnippetId })
        setRunning(true)
    }

    const show = () => {
        if (code === '') {
            triggerEvent(EVENT_SHOW_SNIPPET, { currentSnippetId })
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
            <div className="snippet-show container-fluid">
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