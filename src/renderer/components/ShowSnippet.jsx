import React, { useContext, useEffect, useState } from "react";
import useEventListener from "@use-it/event-listener";
import ReactMarkdown from "react-markdown";
import toast from 'react-hot-toast';

import ShowCodeModal from "./ShowCodeModal";
import AppContext from "../context";
import {
  EVENT_SHOW_SNIPPET,
  EVENT_SNIPPET_SHOWN,
  SET_CODE,
  SET_LOADING,
} from "../constants";
import { triggerEvent } from "../utils";

export default ({ edit }) => {
  const [showCode, setShowCode] = useState(false);
  const { dispatch, snippetsStore, currentSnippetId } = useContext(AppContext);

  useEffect(() => {
    Prism.highlightAll();
  });

  useEventListener(EVENT_SNIPPET_SHOWN, ({ detail: { code, error } }) => {
    dispatch({ type: SET_LOADING, loading: false });
    dispatch({ type: SET_CODE, code });
    if (error) {
      toast.error(error);
      return;
    }

    setShowCode(true);
  });

  const snippet = snippetsStore[currentSnippetId];

  const showSourceCode = () => {
    if (!snippet.code) {
      triggerEvent(EVENT_SHOW_SNIPPET, { currentSnippetId });
      dispatch({ type: SET_LOADING, loading: true });
    }
  };

  const close = () => {
    setShowCode(false);
  };

  return (
    <>
      <div className="snippet-show container-fluid flex-grow-1">
        <button
          className="btn btn-primary float-right"
          onClick={showSourceCode}
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
          {snippet.sub_snippets.map((subSnippetName) => {
            const subSnippet =
              snippetsStore[`${snippet.group}/${subSnippetName}`];
            return (
              <li key={subSnippetName}>
                <h4>{subSnippetName}</h4>
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
