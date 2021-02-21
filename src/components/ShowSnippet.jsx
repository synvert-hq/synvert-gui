import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import LoadingOverlay from 'react-loading-overlay';
import AppContext from '../context'
import Prism from 'prismjs';

export default ({ runSnippet }) => {
    useEffect(() => {
        Prism.highlightAll();
    })

    return (
        <AppContext.Consumer>
            {({ path, snippetsStore, currentSnippetId, running }) => {
                if (!currentSnippetId) return null
                const snippet = snippetsStore[currentSnippetId]
                return (
                    <LoadingOverlay active={running} spinner text='Running snippet...'>
                        <div className="snippet-show">
                            <button className="btn btn-primary float-right" disabled={!path} onClick={runSnippet}>Run</button>
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
            }}
        </AppContext.Consumer>
    )
}