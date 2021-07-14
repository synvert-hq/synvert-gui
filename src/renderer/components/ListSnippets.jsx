import React, { useContext, useEffect, useState } from "react";
import useEventListener from "@use-it/event-listener";
import AppContext from "../context";
import { triggerEvent, searchSnippets, sortSnippets } from "../utils";
import ProgressLogs from "./ProgressLogs";
import {
  EVENT_CHECK_DEPENDENCIES,
  EVENT_CHECKING_DEPENDENCIES,
  EVENT_DEPENDENCIES_CHECKED,
  EVENT_LOAD_SNIPPETS,
  EVENT_SNIPPETS_LOADED,
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
  const [firstError, setFirstError] = useState(true);
  const [checking, setChecking] = useState(false);

  const { currentSnippetId, snippetsStore, dispatch } = useContext(AppContext);

  useEventListener(EVENT_DEPENDENCIES_CHECKED, ({ detail: { error } = {} }) => {
    if (error) {
      dispatch({ type: SET_ERROR, error });
    } else {
      setLoaded(false);
      triggerEvent(EVENT_LOAD_SNIPPETS);
    }
    setChecking(false);
  });

  useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { error } }) => {
    setLoaded(true);
    if (error) {
      if (firstError) {
        setFirstError(false)
        setChecking(true)
        triggerEvent(EVENT_CHECK_DEPENDENCIES);
      } else {
        dispatch({ type: SET_ERROR, error });
      }
    }
  });

  useEffect(() => {
    if (!loaded) {
      setTimeout(() => {
        triggerEvent(EVENT_LOAD_SNIPPETS);
      }, 100)
    }
  }, [loaded]);

  if (!loaded) {
    return <div className="text-center">Loading Official Snippets...</div>;
  }

  if (checking) {
    return <ProgressLogs type={EVENT_CHECKING_DEPENDENCIES} />
  }

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
