import { SET_PATH, SET_SNIPPETS_STORE, SET_CURRENT_SNIPPET_ID, SET_LOADING, SET_NEW_SNIPPET } from './constants'

export default (state = {}, action) => {
    switch (action.type) {
        case SET_PATH:
            return {
                ...state,
                path: action.path,
            }
        case SET_SNIPPETS_STORE:
            return {
                ...state,
                snippetsStore: action.snippetsStore,
            }
        case SET_CURRENT_SNIPPET_ID:
            return {
                ...state,
                currentSnippetId: action.currentSnippetId,
                newSnippet: '',
            }
        case SET_NEW_SNIPPET:
            return {
                ...state,
                newSnippet: action.newSnippet,
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading,
                loadingText: action.loadingText || "Loading...",
            }
        default:
            return state
    }
}