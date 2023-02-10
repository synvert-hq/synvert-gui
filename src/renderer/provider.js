import React, { useReducer } from "react";

import appReducer from "./reducer";
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
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
};
