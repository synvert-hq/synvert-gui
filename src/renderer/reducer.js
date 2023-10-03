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
  REPLACE_TEST_RESULT,
  REMOVE_TEST_RESULT,
  REPLACE_TEST_ACTION,
  REMOVE_TEST_ACTION,
  SET_CURRENT_ACTION_INDEX,
  SET_CURRENT_RESULT_INDEX,
  SET_ROOT_PATH,
  SET_ONLY_PATHS,
  SET_SKIP_PATHS,
  REPLACE_ALL_TEST_RESULTS,
  SET_LANGUAGE,
  SET_INITED,
  PREV_GENERATED_SNIPPET,
  NEXT_GENERATED_SNIPPET,
} from "./constants";
import { getNewSource, isAddFileAction, isRemoveFileAction } from "./utils";

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
          index === state.generatedSnippetIndex ? action.snippetCode : snippet
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
    case REPLACE_TEST_RESULT: {
      const testResults = [...state.testResults];
      const testResult = testResults[action.resultIndex];
      const absolutePath = window.electronAPI.pathJoin(action.rootPath, testResult.filePath);
      if (isAddFileAction(testResult)) {
        const dirPath = window.electronAPI.dirname(absolutePath);
        window.electronAPI.mkdir(dirPath);
        window.electronAPI.writeFile(absolutePath, testResult.actions[0].newCode);
      } else if (isRemoveFileAction(testResult)) {
        window.electronAPI.unlinkFile(absolutePath);
      } else {
        let source = window.electronAPI.readFile(absolutePath, "utf-8");
        const newSource = getNewSource(source, testResult);
        window.electronAPI.writeFile(absolutePath, newSource);
      }
      testResults.splice(action.resultIndex, 1);
      return {
        ...state,
        testResults,
      };
    }
    case REMOVE_TEST_RESULT: {
      const testResults = [...state.testResults];
      testResults.splice(action.resultIndex, 1);
      return {
        ...state,
        testResults,
      };
    }
    case REPLACE_TEST_ACTION: {
      const testResults = [...state.testResults];
      const testResult = testResults[action.resultIndex];
      const actions = testResult.actions;
      const resultAction = actions[action.actionIndex];
      const absolutePath = window.electronAPI.pathJoin(action.rootPath, testResult.filePath);
      if (resultAction.type === "add_file") {
        const dirPath = window.electronAPI.dirname(absolutePath);
        window.electronAPI.mkdir(dirPath);
        window.electronAPI.writeFile(absolutePath, resultAction.newCode);
        // add_file action is the only action
        testResults.splice(action.resultIndex, 1);
      } else if (resultAction.type === "remove_file") {
        window.electronAPI.unlinkFile(absolutePath);
        // remove_file action is the only action
        testResults.splice(action.resultIndex, 1);
      } else {
        let source = window.electronAPI.readFile(absolutePath, "utf-8");
        let offset = 0;
        if (resultAction.type === "group") {
          resultAction.actions.reverse().forEach((childAction) => {
            source = source.slice(0, childAction.start) + childAction.newCode + source.slice(childAction.end);
            offset += (childAction.newCode.length - (childAction.end - childAction.start));
          });
        } else {
          source = source.slice(0, resultAction.start) + resultAction.newCode + source.slice(resultAction.end);
          offset += resultAction.newCode.length - (resultAction.end - resultAction.start);
        }
        window.electronAPI.writeFile(absolutePath, source);
        actions.splice(action.actionIndex, 1);
        if (actions.length > 0) {
          actions.slice(action.actionIndex).forEach((action) => {
            if (action.type === "group") {
              action.actions.forEach((childAction) => {
                childAction.start = childAction.start + offset;
                childAction.end = childAction.end + offset;
              });
            }
            action.start = action.start + offset;
            action.end = action.end + offset;
          });
          testResult.fileSource = source;
        } else {
          testResults.splice(action.resultIndex, 1);
        }
      }
      return {
        ...state,
        testResults,
      };
    }
    case REMOVE_TEST_ACTION: {
      const testResults = [...state.testResults];
      testResults[action.resultIndex].actions.splice(action.actionIndex, 1);
      return {
        ...state,
        testResults,
      };
    }
    case REPLACE_ALL_TEST_RESULTS: {
      const testResults = state.testResults;
      testResults.forEach((testResult) => {
        const absolutePath = window.electronAPI.pathJoin(action.rootPath, testResult.filePath);
        if (isAddFileAction(testResult)) {
          const dirPath = window.electronAPI.dirname(absolutePath);
          window.electronAPI.mkdir(dirPath);
          window.electronAPI.writeFile(absolutePath, testResult.actions[0].newCode);
        } else if (isRemoveFileAction(testResult)) {
          window.electronAPI.unlinkFile(absolutePath);
        } else {
          let source = window.electronAPI.readFile(absolutePath, "utf-8");
          const newSource = getNewSource(source, testResult);
          window.electronAPI.writeFile(absolutePath, newSource);
        }
      });
      return {
        ...state,
        testResults: [],
        currentResultIndex: 0,
        currentActionIndex: 0,
        currentActionStart: 0,
        currentActionEnd: 0,
      };
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
