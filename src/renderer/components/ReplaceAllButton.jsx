import React, { useContext } from "react";

import AppContext from "../context";
import { EVENT_RUN_SNIPPET, REPLACE_ALL_TEST_RESULTS, SET_LOADING } from "../constants";
import { triggerEvent } from "../utils";

const ReplaceAllButton = () => {
  const { language, rootPath, onlyPaths, skipPaths, respectGitignore, snippetCode, testResults, dispatch } = useContext(AppContext);

  const replace = () => {
    if (testResults.length > 0) {
      dispatch({ type: REPLACE_ALL_TEST_RESULTS, testResults, rootPath });
    } else {
      dispatch({ type: SET_LOADING, loading: true, loadingText: "Running... it may take a while" });
      triggerEvent(EVENT_RUN_SNIPPET, { language, rootPath, snippetCode, onlyPaths, skipPaths, respectGitignore });
    }
  };

  return (
    <button className="btn btn-primary ml-2" disabled={!rootPath || snippetCode.length === 0} onClick={replace}>
      Replace All
    </button>
  );
};

export default ReplaceAllButton;
