import React, { useContext, useState } from "react";
import useEventListener from "@use-it/event-listener";
import LoadingOverlay from "@murasoftware/react-loading-overlay";
import toast from 'react-hot-toast';

import AppContext from "../context";
import ListSnippets from "./ListSnippets";
import ShowSnippet from "./ShowSnippet";
import RunSnippet from "./RunSnippet";
import SnippetForm from "./SnippetForm";
import {
  EVENT_SNIPPETS_LOADED,
  EVENT_SYNC_SNIPPETS,
  EVENT_EDIT_SNIPPET,
  EVENT_SNIPPET_EDIT,
  SET_CODE,
  SET_LOADING,
  SET_FORM,
  SET_CUSTOM_SNIPPET,
} from "../constants";
import { SET_SNIPPETS_STORE  } from "../constants";
import { triggerEvent } from "../utils";

export default () => {
  const { currentSnippetId, form, loading, loadingText, dispatch } =
    useContext(AppContext);

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

  useEventListener(EVENT_SNIPPET_EDIT, ({ detail: { code, error } }) => {
    dispatch({ type: SET_LOADING, loading: false });
    dispatch({ type: SET_CODE, code });
    if (error) {
      toast.error(error);
      return;
    }
    dispatch({ type: SET_FORM, form: 'edit' })
    dispatch({ type: SET_CUSTOM_SNIPPET, customSnippet: code })
  });

  const edit = () => {
    triggerEvent(EVENT_EDIT_SNIPPET, { currentSnippetId });
    dispatch({ type: SET_LOADING, loading: true });
  };

  return (
    <LoadingOverlay active={loading} text={loadingText} spinner>
      <div className="main-container d-flex flex-row">
        <div className="sidebar">
          <ListSnippets />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex flex-column main-content">
            {form ? <SnippetForm /> : <ShowSnippet edit={edit} />}
            <RunSnippet />
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};
