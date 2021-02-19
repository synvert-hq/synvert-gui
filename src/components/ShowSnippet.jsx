import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import AppContext from '../context'
import Prism from 'prismjs';

export default () => {
    useEffect(() => {
        Prism.highlightAll();
    })

    return (
        <AppContext.Consumer>
            {({ snippetsStore, currentSnippetId }) => {
                if (!currentSnippetId) return null
                const snippet = snippetsStore[currentSnippetId]
                return (
                    <>
                        <h2>{snippet.group}/{snippet.name}</h2>
                        <div><ReactMarkdown children={snippet.description} /></div>
                    </>
                )
            }}
        </AppContext.Consumer>
    )
}