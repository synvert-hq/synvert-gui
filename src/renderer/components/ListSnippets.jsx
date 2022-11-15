import React, { useContext, useEffect, useState } from "react";
import useEventListener from "@use-it/event-listener";
import toast from 'react-hot-toast';

import AppContext from "../context";
import { baseUrl, triggerEvent, searchSnippets, sortSnippets } from "../utils";
import ProgressLogs from "./ProgressLogs";
import {
  EVENT_CHECK_DEPENDENCIES,
  EVENT_CHECKING_DEPENDENCIES,
  EVENT_DEPENDENCIES_CHECKED,
  EVENT_SNIPPETS_LOADED,
  SET_CURRENT_SNIPPET_ID,
  SET_FORM,
} from "../constants";

const snippetClassname = (snippet, currentSnippetId) =>
  currentSnippetId && `${snippet.group}/${snippet.name}` == currentSnippetId
    ? "list-group-item active"
    : "list-group-item";

export default () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [firstError, setFirstError] = useState(true);
  const [checking, setChecking] = useState(false);

  const { currentSnippetId, dispatch } = useContext(AppContext);

  const loadSnippets = async () => {
    try {
      const response = await fetch(`${baseUrl()}/snippets`, {
        headers: {
          "Content-Type": "application/json",
          "X-SYNVERT-TOKEN": window.electronAPI.getToken(),
          "X-SYNVERT-PLATFORM": "gui",
        },
      });
      const result = await response.json();
      setSnippets(result.snippets);
      setLoaded(true);
    } catch(e) {
      setError(e.message);
    }
  }

  // useEventListener(EVENT_DEPENDENCIES_CHECKED, async ({ detail: { error } = {} }) => {
  //   if (error) {
  //     setLoaded(true);
  //     setError(error);
  //   } else {
  //     setLoaded(false);
  //     await loadSnippets();
  //   }
  //   setChecking(false);
  // });

  useEventListener(EVENT_SNIPPETS_LOADED, ({ detail: { error } }) => {
    setLoaded(true);
    if (error) {
      if (firstError) {
        setFirstError(false)
        setChecking(true)
        triggerEvent(EVENT_CHECK_DEPENDENCIES);
      } else {
        toast.error(error);
      }
    }
  });

  useEffect(() => {
    if (!loaded) {
      setTimeout(loadSnippets, 100)
    }
  }, [loaded]);

  if (!loaded) {
    return <div className="text-center">Loading Official Snippets...</div>;
  }

  if (error) {
    return (
      <div className="ml-4 mr-4">
        <p>{error}</p>
      </div>
    )
  }

  if (checking) {
    return <ProgressLogs type={EVENT_CHECKING_DEPENDENCIES} />
  }

  const newSnippet = () => {
    dispatch({
      type: SET_FORM,
      form: 'new',
    });
    dispatch({
      type: SET_CURRENT_SNIPPET_ID,
      currentSnippetId: null,
    });
  }

  const snippetClicked = (snippet) => {
    dispatch({
      type: SET_FORM,
      form: null,
    });
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
        {searchSnippets(sortSnippets(snippets), searchTerm).map((snippet) => (
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
