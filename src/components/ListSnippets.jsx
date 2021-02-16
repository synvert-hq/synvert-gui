import React from 'react'
import AppContext from '../context'
import { searchSnippets } from '../utils'

const snippetClassname = (snippet, currentSnippet) =>
    currentSnippet && snippet.name == currentSnippet.name && snippet.group == currentSnippet.group ? 'list-group-item active' : 'list-group-item'

export default () => (
    <AppContext.Consumer>
        {({ snippets, currentSnippet, searchTerm, setCurrentSnippet, setSearchTerm, syncSnippets }) => (
            <>
                <div className="d-flex">
                    <input className="flex-grow-1 form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
                    <button type="button" className="btn btn-primary btn-sm ml-2" onClick={syncSnippets}>Sync</button>
                </div>
                <ul className="list-group list-group-flush mt-2">
                    {searchSnippets(snippets, searchTerm).map(snippet => (
                        <li className={snippetClassname(snippet, currentSnippet)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippet(snippet)}>
                            {snippet.group}/{snippet.name}
                        </li>
                    ))}
                </ul>
            </>
        )}
    </AppContext.Consumer>
)