import React, { useContext } from "react";
import useEventListener from "@use-it/event-listener";
import LoadingOverlay from "@murasoftware/react-loading-overlay";

import AppContext from "../context";
import ListSnippets from "./ListSnippets";
import ShowSnippet from "./ShowSnippet";
import RunSnippet from "./RunSnippet";
import SnippetForm from "./SnippetForm";
import TestResults from "./TestResults";
import {
  EVENT_SYNC_SNIPPETS,
  SET_LOADING,
} from "../constants";
import CodeDiff from "./CodeDiff";

export default () => {
  const { showForm, showTestResults, loading, loadingText, dispatch } = useContext(AppContext);

  useEventListener(
    EVENT_SYNC_SNIPPETS,
    () => { dispatch({ type: SET_LOADING, loading: true, loadingText: 'Syncing Snippets...' }) }
  );

  return (
    <LoadingOverlay active={loading} text={loadingText} spinner>
      {showTestResults ? (
        <div className="main-container d-flex flex-row">
          <div className="sidebar">
            <TestResults />
          </div>
          <div className="flex-grow-1">
            <div className="main-content">
              <CodeDiff />
            </div>
          </div>
        </div>
      ) : (
        <div className="main-container d-flex flex-row">
          <div className="sidebar">
            <ListSnippets />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-column main-content">
              {showForm ? <SnippetForm /> : <ShowSnippet />}
              <RunSnippet />
            </div>
          </div>
        </div>
      )}
    </LoadingOverlay>
  );
};
