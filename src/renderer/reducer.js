import {
  SET_SNIPPETS_STORE,
  SET_CURRENT_SNIPPET_ID,
  SET_LOADING,
  SET_GENERATED_SNIPPETS,
  SET_GENERATED_SNIPPET_INDEX,
  SET_GENERATED_SNIPPET,
  SET_SHOW_FORM,
  SET_SHOW_TEST_RESULTS,
  SET_TEST_RESULTS,
  SET_CURRENT_ACTION_INDEX,
  SET_CURRENT_RESULT_INDEX,
  SET_ROOT_PATH,
  SET_ONLY_PATHS,
  SET_SKIP_PATHS,
  SET_LANGUAGE,
  SET_PARSER,
  SET_INITED,
  PREV_GENERATED_SNIPPET,
  NEXT_GENERATED_SNIPPET,
  UPDATE_TEST_RESULTS,
} from "./constants";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_INITED: {
      return {
        ...state,
        inited: action.inited,
      };
    }
    case SET_LANGUAGE: {
      return {
        ...state,
        language: action.language,
      };
    }
    case SET_PARSER: {
      return {
        ...state,
        parser: action.parser,
      };
    }
    case SET_SNIPPETS_STORE: {
      return {
        ...state,
        snippetsStore: action.snippetsStore,
      };
    }
    case SET_CURRENT_SNIPPET_ID: {
      const snippetCode = action.currentSnippetId ? state.snippetsStore[action.currentSnippetId].source_code : "";
      return {
        ...state,
        currentSnippetId: action.currentSnippetId,
        snippetCode,
        generatedSnippets: [],
        generatedSnippetIndex: 0,
      };
    }
    case SET_GENERATED_SNIPPETS: {
      return {
        ...state,
        currentSnippetId: null,
        generatedSnippets: action.generatedSnippets,
        generatedSnippetIndex: 0,
        snippetCode: action.generatedSnippets[0] || "",
        snippetError: action.snippetError,
      };
    }
    case SET_GENERATED_SNIPPET_INDEX: {
      return {
        ...state,
        generatedSnippetIndex: action.generatedSnippetIndex,
        snippetCode: action.generatedSnippets[action.generatedSnippetIndex],
      };
    }
    case SET_GENERATED_SNIPPET: {
      return {
        ...state,
        generatedSnippets: state.generatedSnippets.map((snippet, index) =>
          index === state.generatedSnippetIndex ? action.snippetCode : snippet,
        ),
        snippetCode: action.snippetCode,
      };
    }
    case PREV_GENERATED_SNIPPET: {
      return {
        ...state,
        generatedSnippetIndex: state.generatedSnippetIndex - 1,
        snippetCode: state.generatedSnippets[state.generatedSnippetIndex - 1],
      };
    }
    case NEXT_GENERATED_SNIPPET: {
      return {
        ...state,
        generatedSnippetIndex: state.generatedSnippetIndex + 1,
        snippetCode: state.generatedSnippets[state.generatedSnippetIndex + 1],
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        loading: action.loading,
        loadingText: action.loadingText || "Loading...",
      };
    }
    case SET_SHOW_FORM: {
      return {
        ...state,
        showForm: action.showForm,
      };
    }
    case SET_SHOW_TEST_RESULTS: {
      return {
        ...state,
        showTestResults: action.showTestResults,
      };
    }
    case SET_TEST_RESULTS: {
      return {
        ...state,
        testResults: action.testResults,
        currentResultIndex: 0,
        currentActionIndex: 0,
        currentActionStart: 0,
        currentActionEnd: 0,
      };
    }
    case UPDATE_TEST_RESULTS: {
      return {
        ...state,
        testResults: action.testResults,
      }
    }
    case SET_CURRENT_RESULT_INDEX: {
      return {
        ...state,
        currentResultIndex: action.resultIndex,
        currentActionIndex: 0,
        currentActionStart: 0,
        currentActionEnd: 0,
      };
    }
    case SET_CURRENT_ACTION_INDEX: {
      return {
        ...state,
        currentResultIndex: action.resultIndex,
        currentActionIndex: action.actionIndex,
        currentActionStart: action.actionStart,
        currentActionEnd: action.actionEnd,
      };
    }
    case SET_ROOT_PATH: {
      return {
        ...state,
        rootPath: action.rootPath,
        onlyPaths: action.onlyPaths,
        skipPaths: action.skipPaths,
      };
    }
    case SET_ONLY_PATHS: {
      return {
        ...state,
        onlyPaths: action.onlyPaths,
      };
    }
    case SET_SKIP_PATHS: {
      return {
        ...state,
        skipPaths: action.skipPaths,
      };
    }
    default:
      return state;
  }
};
