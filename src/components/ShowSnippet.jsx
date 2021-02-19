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
            {({ currentSnippet }) => (
                <div>{currentSnippet ? <ReactMarkdown children={currentSnippet.description} /> : ''}</div>
            )}
        </AppContext.Consumer>
    )
}