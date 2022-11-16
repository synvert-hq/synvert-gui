import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import ShowCodeModal from "./ShowCodeModal";
import AppContext from "../context";
import { SET_FORM } from "../constants";

export default () => {
  const [showCode, setShowCode] = useState(false);
  const { snippetsStore, currentSnippetId, dispatch } = useContext(AppContext);

  useEffect(() => {
    Prism.highlightAll();
  });

  const snippet = snippetsStore[currentSnippetId];

  const close = () => {
    setShowCode(false);
  };

  const edit = () => {
    dispatch({ type : SET_FORM, form: 'edit' })
  };

  return (
    <>
      <div className="snippet-show container-fluid flex-grow-1">
        <button
          className="btn btn-primary float-right"
          onClick={() => setShowCode(true)}
        >
          Show
        </button>
        <button
          className="btn btn-primary float-right mr-2"
          onClick={edit}
        >
          Edit
        </button>
        <h2>
          {snippet.group}/{snippet.name}
        </h2>
        <div className="float-right">
          {snippet.ruby_version && (
            <span className="badge badge-info">
              ruby {snippet.ruby_version}
            </span>
          )}
          {snippet.gem_spec && (
            <span className="badge badge-info">
              {snippet.gem_spec.name} {snippet.gem_spec.version}
            </span>
          )}
        </div>
        <div>
          <ReactMarkdown children={snippet.description} />
        </div>
        <ul>
          {snippet.sub_snippet_ids.map((subSnippetId) => {
            const subSnippet = snippetsStore[subSnippetId];
            return (
              <li key={subSnippetId}>
                <h4>{subSnippet.group}/{subSnippet.name}</h4>
                <div>
                  <ReactMarkdown children={subSnippet.description} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {showCode && (
        <ShowCodeModal snippet={snippet} close={close} />
      )}
    </>
  );
};
