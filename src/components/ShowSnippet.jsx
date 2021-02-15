import React from 'react'
import ReactMarkdown from 'react-markdown'
import AppContext from '../context'

const ShowSnippet = () => (
    <AppContext.Consumer>
        {({ currentSnippet }) => (
            <div>{currentSnippet ? <ReactMarkdown children={currentSnippet.description} /> : ''}</div>
        )}
    </AppContext.Consumer>
)

export default ShowSnippet