import React from 'react'

export default React.createContext({
    snippets: [],
    currentSnippet: null,
    setSnippets: (snippets) => {},
    setCurrnetSnippet: (snippet) => {},
 })