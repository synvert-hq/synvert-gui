import React, { useReducer } from 'react'

import appReducer from './reducer'
import AppContext from './context'
import { getLanguage, getOnlyPaths, getRootPath, getSkipPaths } from './utils'

const initialState = {
    language: getLanguage(),
    rootPath: getRootPath(),
    onlyPaths: getOnlyPaths(),
    skipPaths: getSkipPaths(),
    snippetsStore: {},
    currentSnippetId: null,
    snippetCode: '',
    snippetError: "",
    loading: false,
    loadingText: 'Loading...',
    showForm: true,
    showTestResults: false,
    testResults: [],
    currentResultIndex: 0,
    currentActionIndex: 0,
}

export default ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    return (
        <AppContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}