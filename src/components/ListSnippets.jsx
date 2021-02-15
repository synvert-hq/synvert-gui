import React from 'react'
import AppContext from '../context'

const ListSnippets = () => (
    <AppContext.Consumer>
        {({ snippets }) => (
            <ul>
                {snippets.map(snippet => (
                    <li key={`${snippet.group}/${snippet.name}`}>
                        {snippet.group}/{snippet.name}
                    </li>
                ))}
            </ul>
        )}
    </AppContext.Consumer>
)

export default ListSnippets