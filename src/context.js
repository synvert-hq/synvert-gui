import React from 'react'

export default React.createContext({
    path: '',
    snippets: [],
    currentSnippet: null,
    searchTerm: '',
    setPath: (path) => {},
    setSnippets: (snippets) => {},
    setCurrnetSnippet: (snippet) => {},
    setSearchTerm: (term) => {},
    runSnippet: () => {},
 })