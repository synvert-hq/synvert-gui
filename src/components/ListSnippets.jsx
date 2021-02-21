import LoadingOverlay from 'react-loading-overlay';
import React from 'react'
import AppContext from '../context'
import { searchSnippets, sortSnippets } from '../utils'

const snippetClassname = (snippet, currentSnippetId) =>
    currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId ? 'list-group-item active' : 'list-group-item'

export default ({ setSearchTerm, setCurrentSnippetId, syncSnippets }) => (
    <AppContext.Consumer>
        {({ snippetsStore, currentSnippetId, searchTerm, syncing }) => {
            if (Object.keys(snippetsStore).length === 0) {
                return (
                    <div className="ml-5 mr-5">Loading Snippets...</div>
                )
            }

            return (
                <LoadingOverlay active={syncing} spinner text='Syncing snippets...'>
                    <div className="d-flex">
                        <input className="flex-grow-1 form-control" type="text" value={searchTerm} placeholder="search snippets" onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" className="btn btn-primary btn-sm ml-2" onClick={syncSnippets}>Sync</button>
                    </div>
                    <ul className="snippets-list list-group list-group-flush mt-2">
                        {searchSnippets(sortSnippets(Object.values(snippetsStore)), searchTerm).map(snippet => (
                            <li role="button" className={snippetClassname(snippet, currentSnippetId)} key={`${snippet.group}/${snippet.name}`} onClick={() => setCurrentSnippetId(`${snippet.group}/${snippet.name}`)}>
                                {snippet.group}/{snippet.name}
                            </li>
                        ))}
                    </ul>
                </LoadingOverlay>
            )
        }}
    </AppContext.Consumer>
)