import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import { baseUrl, searchSnippets, sortSnippets, convertSnippetsToStore } from "../utils";
import {
  SET_SNIPPETS_STORE,
  SET_CURRENT_SNIPPET_ID,
  SET_SHOW_FORM,
} from "../constants";
import LanguageSelect from "./LanguageSelect";

const snippetClassname = (snippet, currentSnippetId) =>
  currentSnippetId && snippet.id == currentSnippetId
    ? "list-group-item active"
    : "list-group-item";

export default () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const { currentSnippetId, snippetsStore, dispatch } = useContext(AppContext);

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
      const snippetsStore = convertSnippetsToStore(result.snippets);
      dispatch({ type: SET_SNIPPETS_STORE, snippetsStore });
      setLoaded(true)
    } catch(e) {
      setError(e.message);
    }
  }

  useEffect(() => { loadSnippets() }, []);

  if (!loaded) {
    return <div className="text-center mt-4">Loading Official Snippets...</div>;
  }

  if (error) {
    return (
      <div className="ml-4 mr-4">
        <p>{error}</p>
      </div>
    )
  }

  const newSnippet = () => {
    dispatch({
      type: SET_SHOW_FORM,
      showForm: true,
    });
    dispatch({
      type: SET_CURRENT_SNIPPET_ID,
      currentSnippetId: null,
    });
  }

  const snippetClicked = (snippet) => {
    dispatch({
      type: SET_SHOW_FORM,
      showForm: false,
    });
    dispatch({
      type: SET_CURRENT_SNIPPET_ID,
      currentSnippetId: snippet.id,
    });
  };

  return (
    <div className="snippets-list">
      <LanguageSelect />
      <div className="search-box d-flex">
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
      <ul className="list-group list-group-flush mt-2">
        {searchSnippets(sortSnippets((Object.values(snippetsStore))), searchTerm).map((snippet) => (
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
