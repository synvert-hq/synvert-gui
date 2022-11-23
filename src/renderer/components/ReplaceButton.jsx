import React, { useContext } from "react";

import AppContext from "../context";
import { EVENT_RUN_SNIPPET, REPLACE_ALL_TEST_RESULTS, SET_LOADING } from "../constants";
import { triggerEvent } from "../utils";

const ReplaceButton = () => {
  const { rootPath, onlyPaths, skipPaths, snippetCode, testResults, dispatch } = useContext(AppContext);

  const replace = () => {
    if (testResults.length > 0) {
      dispatch({ type: REPLACE_ALL_TEST_RESULTS, rootPath, testResults });
    } else {
      triggerEvent(EVENT_RUN_SNIPPET, { rootPath, snippetCode, onlyPaths, skipPaths });
      dispatch({ type: SET_LOADING, loading: true, loadingText: 'Running... it may take a while' });
    }
  };

  return (
    <button className="btn btn-primary btn-sm ml-2" disabled={!rootPath || (snippetCode.length === 0)} onClick={replace}>
      Replace
    </button>
  )
}

export default ReplaceButton;