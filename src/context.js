import React from 'react'

export default React.createContext({
    path: '',
    snippets: [],
    currentSnippet: null,
    setPath: (path) => {},
    setSnippets: (snippets) => {},
    setCurrnetSnippet: (snippet) => {},
    runSnippet: () => {},
 })