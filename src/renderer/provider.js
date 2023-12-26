import React from "react";
import { useReducerAsync } from "use-reducer-async";

import appReducer from "./reducer";
import appAction from "./action";
import AppContext from "./context";
import { getInited, getLanguage, getOnlyPaths, getRootPath, getSkipPaths } from "./utils";

const initialState = {
  inited: getInited(),
  language: getLanguage(),
  rootPath: getRootPath(),
  onlyPaths: getOnlyPaths(),
  skipPaths: getSkipPaths(),
  snippetsStore: {},
  currentSnippetId: null,
  generatedSnippets: [],
  generatedSnippetIndex: 0,
  snippetCode: "",
  snippetError: "",
  loading: false,
  loadingText: "Loading...",
  showForm: true,
  showTestResults: false,
  testResults: [],
  currentResultIndex: 0,
  currentActionIndex: 0,
  currentActionStart: 0,
  currentActionEnd: 0,
};

export default ({ children }) => {
  const [state, dispatch] = useReducerAsync(appReducer, initialState, appAction);

  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
};
