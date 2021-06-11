import 'diff2html/bundles/css/diff2html.min.css';
import React, { useContext, useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import * as Diff2Html from 'diff2html';
import AppContext from '../context'
import { EVENT_COMMIT_DIFF, EVENT_DIFF_COMMITTED, EVENT_SHOW_SNIPPET, EVENT_SNIPPET_DIFF_SHOWN, EVENT_SNIPPET_SHOWN, SET_ERROR, SET_LOADING } from '../constants'
import { triggerEvent } from '../utils'

export default () => {
    const [code, setCode] = useState('')
    const [showCode, setShowCode] = useState(false)
    const [diffHtml, setDiffHtml] = useState('')
    const [showDiff, setShowDiff] = useState(false)
    const [showCommit, setShowCommit] = useState(false)
    const [commitMessage, setCommitMessage] = useState('')
    const [committing, setCommitting] = useState(false)

    const { path, snippetsStore, currentSnippetId, dispatch } = useContext(AppContext)

    useEffect(() => {
        Prism.highlightAll();
    })

    useEffect(() => {
        setCode('')
        setDiffHtml('')
    }, [currentSnippetId])

    useEventListener(EVENT_SNIPPET_DIFF_SHOWN, ({ detail: { diff, error } }) => {
        dispatch({ type: SET_LOADING, loading: false })
        dispatch({ type: SET_ERROR, loading: error })
        if (error) return
        if (diff) {
            const diffHtml = Diff2Html.html(diff, {
                    drawFileList: false,
                    matching: 'lines',
                    outputFormat: 'line-by-line',
            });
            setDiffHtml(diffHtml)
            setShowDiff(true)
            setCommitMessage(snippetsStore[currentSnippetId].name.replaceAll(/(\d+)_(\d+)/g, `${1}.${2}`).replaceAll('_', ' '))
        }
    })

    useEventListener(EVENT_DIFF_COMMITTED, ({ detail: { error } }) => {
        dispatch({ type: SET_ERROR, loading: error })
        setShowCommit(false)
        setShowDiff(false)
        setCommitMessage('')
        setCommitting(false)
    })

    useEventListener(EVENT_SNIPPET_SHOWN, ({ detail: { code, error }}) => {
        dispatch({ type: SET_ERROR, loading: error })
        if (!error) {
            setCode(code)
        }
    })

    const showSourceCode = () => {
        if (code === '') {
            triggerEvent(EVENT_SHOW_SNIPPET, { currentSnippetId })
        }
        setShowCode(true)
        setShowDiff(false)
    }

    const close = () => {
        setShowCode(false)
        setShowDiff(false)
        setShowCommit(false)
    }

    const commitNow = () => {
        setShowCommit(true)
    }

    const confirmCommit = () => {
        const affected_files = snippetsStore[currentSnippetId].affected_files
        triggerEvent(EVENT_COMMIT_DIFF, { path, commitMessage, affected_files })
        setCommitting(true)
    }
    if (!currentSnippetId) return null

    const snippet = snippetsStore[currentSnippetId]

    return (
        <>
            <div className="snippet-show container-fluid flex-grow-1">
                <button className="btn btn-primary float-right" onClick={showSourceCode}>Show Source Code</button>
                <h2>{snippet.group}/{snippet.name}</h2>
                <div className="float-right">
                    {snippet.ruby_version && <span className="badge badge-info">ruby {snippet.ruby_version}</span>}
                    {snippet.gem_spec && <span className="badge badge-info">{snippet.gem_spec.name} {snippet.gem_spec.version}</span>}
                </div>
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
            {showCode && (
                <>
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
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
            {showDiff && (
                <>
                    <div className="modal fade show" data-backdrop="static" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-body">
                                    {diffHtml === '' ? 'Loading...' : (
                                        <div dangerouslySetInnerHTML={{ __html: diffHtml }} />
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {showCommit ? (
                                        <>
                                            <textarea className="commit-message-input" value={commitMessage} onChange={e => setCommitMessage(e.target.value)} />
                                            <button type="button" className="btn btn-primary" disabled={committing} onClick={confirmCommit}>{committing ? 'Committing...' : 'Confirm Commit'}</button>
                                        </>
                                    ) : (
                                        <button type="button" className="btn btn-primary" onClick={commitNow}>Commit Now</button>
                                    )}
                                    <button type="button" className="btn btn-secondary" onClick={close}>No, I'll commit by myself</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    )
}