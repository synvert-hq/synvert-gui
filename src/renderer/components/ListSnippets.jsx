import React, { useContext, useEffect, useState } from "react";
import useEventListener from "@use-it/event-listener";
import AppContext from "../context";
import { triggerEvent, searchSnippets, sortSnippets } from "../utils";
import {
  EVENT_LOAD_SNIPPETS,
  EVENT_SNIPPETS_LOADED,
  EVENT_SYNC_SNIPPETS,
  SET_CURRENT_SNIPPET_ID,
  SET_ERROR,
} from "../constants";

const snippetClassname = (snippet, currentSnippetId) =>
  currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId
    ? "list-group-item active"
    : "list-group-item";

export default () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { currentSnippetId, snippetsStore, dispatch } = useContext(AppContext);

  useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { error } }) => {
    setLoaded(true);
    setSyncing(false);
    if (error) {
      dispatch({ type: SET_ERROR, error });
    }
  });

  useEffect(() => {
    if (!loaded) {
      triggerEvent(EVENT_LOAD_SNIPPETS);
    }
  }, [loaded]);

  if (!loaded) {
    return <div className="text-center">Loading Snippets...</div>;
  }

  const syncSnippets = () => {
    setSyncing(true);
    triggerEvent(EVENT_SYNC_SNIPPETS);
  };

  const newSnippet = () => {
    dispatch({
      type: SET_CURRENT_SNIPPET_ID,
      currentSnippetId: 'new',
    });
  }

  const snippetClicked = (snippet) => {
    dispatch({
      type: SET_CURRENT_SNIPPET_ID,
      currentSnippetId: `${snippet.group}/${snippet.name}`,
    });
  };

  return (
    <div className="container-fluid">
      <div className="d-flex">
        <input
          className="flex-grow-1 form-control"
          type="text"
          value={searchTerm}
          placeholder="search snippets"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btm-sm ml-2"
          onClick={newSnippet}
        >
          New
        </button>
      </div>
      <ul className="snippets-list list-group list-group-flush mt-2">
        {searchSnippets(
          sortSnippets(Object.values(snippetsStore)),
          searchTerm
        ).map((snippet) => (
          <li
            role="button"
            className={snippetClassname(snippet, currentSnippetId)}
            key={`${snippet.group}/${snippet.name}`}
            onClick={() => snippetClicked(snippet)}
          >
            {snippet.group}/{snippet.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
