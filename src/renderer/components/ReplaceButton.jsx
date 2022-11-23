import React, { useContext } from "react";

import AppContext from "../context";
import { EVENT_RUN_SNIPPET, SET_LOADING } from "../constants";
import { triggerEvent } from "../utils";

const ReplaceButton = () => {
  const { rootPath, onlyPaths, skipPaths, snippetCode, dispatch } = useContext(AppContext);

  const replace = () => {
    triggerEvent(EVENT_RUN_SNIPPET, { rootPath, snippetCode, onlyPaths, skipPaths });
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Running... it may take a while' });
  };

  return (
    <button className="btn btn-primary btn-sm ml-2" disabled={!rootPath || (snippetCode.length === 0)} onClick={replace}>
      Replace
    </button>
  )
}

export default ReplaceButton;