import React, { useState, useEffect, useContext } from "react";

import AppContext from "../context";
import { SET_GENERATED_SNIPPET } from "../constants";

const SnippetCode = ({ rows }) => {
  const { dispatch, snippetCode, snippetError } = useContext(AppContext);
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setCode(snippetCode);
  }, [snippetCode])

  useEffect(() => {
    setError(snippetError);
  }, [snippetError]);

  const updateSnippetCode = (snippetCode) => {
    if (typeof snippetCode !== "undefined") {
      dispatch({
        type: SET_GENERATED_SNIPPET,
        snippetCode,
        snippetError: "",
      });
    }
  }

  return (
    <div className="form-group">
      {error !== '' && (<span className="text-danger">{error}</span>)}
      <textarea
        className="form-control"
        rows={rows}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onBlur={(e) => updateSnippetCode(e.target.value)}
      ></textarea>
    </div>
  )
}

export default SnippetCode;