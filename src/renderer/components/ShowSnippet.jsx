import React, { useContext, useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import ReactMarkdown from 'react-markdown'

import ShowCodeModal from './ShowCodeModal'
import ShowDiffModal from './ShowDiffModal'
import AppContext from '../context'
import { EVENT_SHOW_SNIPPET, EVENT_SNIPPET_SHOWN, EVENT_SNIPPET_DIFF_SHOWN, SET_LOADING, SET_ERROR } from '../constants'
import { triggerEvent } from '../utils'

export default () => {
    const [showCode, setShowCode] = useState(false)
    const [showDiff, setShowDiff] = useState(false)
    const [code, setCode] = useState('')
    const [diff, setDiff] = useState('')
    const { dispatch } = useContext(AppContext)

    const { snippetsStore, currentSnippetId } = useContext(AppContext)

    useEffect(() => {
        Prism.highlightAll();
    })

    useEventListener(EVENT_SNIPPET_DIFF_SHOWN, ({ detail: { diff, error } }) => {
        dispatch({ type: SET_LOADING, loading: false })
        dispatch({ type: SET_ERROR, loading: error })
        if (error) return
        if (diff) {
            setDiff(diff)
            setShowDiff(true)
        }
    })

    useEventListener(EVENT_SNIPPET_SHOWN, ({ detail: { code, error }}) => {
        dispatch({ type: SET_LOADING, loading: false })
        dispatch({ type: SET_ERROR, error })
        if (!error) {
            setCode(code)
            setShowCode(true)
        }
    })

    const showSourceCode = () => {
        triggerEvent(EVENT_SHOW_SNIPPET, { currentSnippetId })
        dispatch({ type: SET_LOADING, loading: true })
    }

    const close = () => {
        setShowCode(false)
        setShowDiff(false)
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
            {showCode && <ShowCodeModal snippet={snippet} code={code} close={close} />}
            {showDiff && <ShowDiffModal snippet={snippet} diff={diff} close={close} />}
        </>
    )
}