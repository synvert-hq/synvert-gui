import React, { useContext } from "react";

import AppContext from "../context";
import { EVENT_TEST_SNIPPET, SET_LOADING } from "../constants";
import { triggerEvent } from "../utils";

const SearchButton = () => {
  const { language, rootPath, onlyPaths, skipPaths, respectGitignore, snippetCode, dispatch } = useContext(AppContext);

  const search = () => {
    dispatch({ type: SET_LOADING, loading: true, loadingText: "Searching... it may take a while" });
    triggerEvent(EVENT_TEST_SNIPPET, { language, rootPath, snippetCode, onlyPaths, skipPaths, respectGitignore });
  };

  return (
    <button className="btn btn-primary ml-2" disabled={!rootPath || snippetCode.length === 0} onClick={search}>
      Search
    </button>
  );
};

export default SearchButton;
