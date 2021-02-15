import React from 'react'
import AppContext from '../context'

export default () => (
    <AppContext.Consumer>
        {({ snippets, setCurrentSnippet }) => (
            <ul>
                {snippets.map(snippet => (
                    <li key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippet(snippet)}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        )}
    </AppContext.Consumer>
)