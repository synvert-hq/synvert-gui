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
                        <ul>
                            {snippet.sub_snippets.map(subSnippetName => {
                                const subSnippet = snippetsStore[`${snippet.group}/${subSnippetName}`]
                                return (
                                    <li>
                                        <h4>{subSnippet.name}</h4>
                                        <div><ReactMarkdown children={subSnippet.description} /></div>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )
            }}
        </AppContext.Consumer>
    )
}