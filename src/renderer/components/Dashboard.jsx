import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useState } from "react";
import useEventListener from "@use-it/event-listener";
import LoadingOverlay from "react-loading-overlay";

import AppContext from "../context";
import ListSnippets from "./ListSnippets";
import ShowSnippet from "./ShowSnippet";
import RunSnippet from "./RunSnippet";
import NewSnippet from "./NewSnippet";
import SelectDependencies from "./SelectDependencies";
import Error from "./Error";
import {
  EVENT_SNIPPETS_LOADED,
  EVENT_SYNC_SNIPPETS,
  SET_LOADING,
} from "../constants";
import { SET_SNIPPETS_STORE  } from "../constants";
import { dependencySelected } from "../utils";

export default () => {
  const { currentSnippetId, loading, loadingText, dispatch } =
    useContext(AppContext);

  const [dependency, setDependency] = useState(dependencySelected());

  useEventListener(
    EVENT_SYNC_SNIPPETS,
    () => { dispatch({ type: SET_LOADING, loading: true, loadingText: 'Syncing Snippets...' }) }
  );

  useEventListener(
    EVENT_SNIPPETS_LOADED,
    ({ detail: { snippetsStore } = {} }) => {
      dispatch({ type: SET_LOADING, loading: false });
      if (snippetsStore) {
        dispatch({ type: SET_SNIPPETS_STORE, snippetsStore });
      }
    }
  );

  if (!dependency) {
    return <SelectDependencies setDependency={setDependency} />;
  }

  return (
    <LoadingOverlay active={loading} text={loadingText} spinner>
      <div className="main-container d-flex flex-row">
        <Error />
        <div className="sidebar">
          <ListSnippets />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex flex-column main-content">
            {currentSnippetId === "new" ? <NewSnippet /> : <ShowSnippet />}
            <RunSnippet />
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};
