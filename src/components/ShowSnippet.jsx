import React from 'react'
import ReactMarkdown from 'react-markdown'
import AppContext from '../context'

export default () => (
    <AppContext.Consumer>
        {({ currentSnippet }) => (
            <div>{currentSnippet ? <ReactMarkdown children={currentSnippet.description} /> : ''}</div>
        )}
    </AppContext.Consumer>
)