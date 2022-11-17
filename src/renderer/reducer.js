import { SET_PATH, SET_SNIPPETS_STORE, SET_CURRENT_SNIPPET_ID, SET_LOADING, SET_GENERATED_SNIPPET, SET_SHOW_FORM } from './constants'

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
                snippetCode: state.snippetsStore[action.currentSnippetId].source_code,
            }
        case SET_GENERATED_SNIPPET:
            return {
                ...state,
                currentSnippetId: null,
                snippetCode: action.snippetCode,
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading,
                loadingText: action.loadingText || "Loading...",
            }

        case SET_SHOW_FORM:
            return {
                ...state,
                showForm: action.showForm,
            }
        default:
            return state
    }
}