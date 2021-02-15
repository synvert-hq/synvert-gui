import React from 'react'
import AppContext from '../context'

const snippetClassname = (snippet, currentSnippet) =>
    currentSnippet && snippet.name == currentSnippet.name && snippet.group == currentSnippet.group ? 'list-group-item active' : 'list-group-item'

export default () => (
    <AppContext.Consumer>
        {({ snippets, currentSnippet, setCurrentSnippet, syncSnippets }) => (
            <>
                <div className="overflow-hidden">
                    <button type="button" className="btn btn-primary float-right" onClick={syncSnippets}>Sync Snippets</button>
                </div>
                <ul className="list-group list-group-flush mt-2">
                    {snippets.map(snippet => (
                        <li className={snippetClassname(snippet, currentSnippet)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippet(snippet)}>
                            {snippet.group}/{snippet.name}
                        </li>
                    ))}
                </ul>
            </>
        )}
    </AppContext.Consumer>
)