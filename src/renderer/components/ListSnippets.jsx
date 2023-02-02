import React, { useContext, useEffect, useState } from "react";
import { sortSnippets, filterSnippets } from "synvert-ui-common";

import AppContext from "../context";
import { convertSnippetsToStore, baseUrlByLanguage } from "../utils";
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
  const { language, currentSnippetId, snippetsStore, dispatch } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const loadSnippets = async (language) => {
    try {
      setLoaded(false);
      const response = await fetch(`${baseUrlByLanguage(language)}/snippets`, {
        headers: {
          "Content-Type": "application/json",
          "X-SYNVERT-TOKEN": window.electronAPI.getToken(),
          "X-SYNVERT-PLATFORM": "gui",
        },
      });
      const result = await response.json();
      const snippetsStore = convertSnippetsToStore(result.snippets);
      dispatch({ type: SET_SNIPPETS_STORE, snippetsStore });
      setLoaded(true);
      setError(null);
    } catch(e) {
      setError(e.message);
    }
  }

  useEffect(() => { loadSnippets(language) }, [language]);

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
      {error && (
        <div className="text-center text-danger mt-2">{error}</div>
      )}
      {loaded ? (
        <ul className="list-group list-group-flush mt-2">
          {sortSnippets(filterSnippets(Object.values(snippetsStore), searchTerm), searchTerm).map((snippet) => (
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
      ) : (
        <div className="text-center mt-2">Loading Official Snippets...</div>
      )}
    </div>
  );
};
