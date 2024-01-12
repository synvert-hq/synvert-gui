import React, { useState, useEffect, useContext } from "react";

import AppContext from "../context";
import { SET_GENERATED_SNIPPET, PREV_GENERATED_SNIPPET, NEXT_GENERATED_SNIPPET } from "../constants";

const SnippetCode = ({ rows }) => {
  const { language, snippetCode, snippetError, generatedSnippets, generatedSnippetIndex, dispatch } =
    useContext(AppContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCode("");
  }, [language]);

  useEffect(() => {
    setCode(snippetCode);
  }, [snippetCode]);

  useEffect(() => {
    setError(snippetError);
  }, [snippetError]);

  const updateSnippetCode = (snippetCode) => {
    if (typeof snippetCode !== "undefined") {
      dispatch({
        type: SET_GENERATED_SNIPPET,
        snippetCode,
      });
    }
  };

  const getPrevSnippet = () => {
    dispatch({ type: PREV_GENERATED_SNIPPET });
  };

  const getNextSnippet = () => {
    dispatch({ type: NEXT_GENERATED_SNIPPET });
  };

  return (
    <div className="form-group">
      <div className="float-right">
        {generatedSnippets.length > 0 && generatedSnippetIndex > 0 && (
          <button type="button" className="btn btn-link" onClick={getPrevSnippet}>
            &lt;&nbsp;Prev
          </button>
        )}
        {generatedSnippets.length > 0 && generatedSnippetIndex < generatedSnippets.length - 1 && (
          <button type="button" className="btn btn-link" onClick={getNextSnippet}>
            Next&nbsp;&gt;
          </button>
        )}
      </div>
      {error !== "" && (
        <span className="text-danger">
          {error}
          <br />
          <br />
          If it is our fault, we will see the error and try to fix it ASAP.
        </span>
      )}
      <textarea
        className="form-control"
        rows={rows}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onBlur={(e) => updateSnippetCode(e.target.value)}
      ></textarea>
    </div>
  );
};

export default SnippetCode;
