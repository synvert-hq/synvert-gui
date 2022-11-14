import React, { useContext, useState } from "react";
import useEventListener from "@use-it/event-listener";
import toast from 'react-hot-toast';

import AppContext from "../context";
import {
  EVENT_RUN_SNIPPET,
  EVENT_SNIPPET_RUN,
  EVENT_SHOW_SNIPPET_DIFF,
  EVENT_SNIPPET_DIFF_SHOWN,
  SET_PATH,
  SET_LOADING,
  EVENT_EXECUTE_SNIPPET,
} from "../constants";
import {
  triggerEvent,
  showDiffsSelected,
  showDiffsAskMeSelected,
  showDiffsAlwaysShowSelected,
  selectShowDiffsAlwaysShow,
  selectShowDiffsNeverShow,
  setWorkingDir,
} from "../utils";
import ConfirmDiffModal from "./ConfirmDiffModal";
import ShowDiffModal from "./ShowDiffModal";

export default () => {
  const { path, snippetsStore, currentSnippetId, customSnippet, form, dispatch } =
    useContext(AppContext);
  const [showConfirmDiff, setShowConfirmDiff] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diff, setDiff] = useState("");
  const snippet = snippetsStore[currentSnippetId];

  useEventListener(EVENT_SNIPPET_DIFF_SHOWN, ({ detail: { diff, error } }) => {
    dispatch({ type: SET_LOADING, loading: false });
    if (error) {
      toast.error(error);
      return;
    }
    if (diff) {
      setDiff(diff);
      setShowDiff(true);
    }
  });

  useEventListener(
    EVENT_SNIPPET_RUN,
    ({ detail: { affectedFiles, error } = {} }) => {
      dispatch({ type: SET_LOADING, loading: false });
      if (error) {
        toast.error(error);
        return;
      }
      if (!affectedFiles || affectedFiles.length == 0) {
        toast('No files affected by this snippet');
        return;
      }

      if (showDiffsAlwaysShowSelected()) {
        dispatch({ type: SET_LOADING, loading: true });
        triggerEvent(EVENT_SHOW_SNIPPET_DIFF, { path });
      } else if (!showDiffsSelected() || showDiffsAskMeSelected()) {
        setShowConfirmDiff(true);
      }
    }
  );

  const selectPath = async () => {
    const filePath = await window.electronAPI.openFile()
    if (filePath) {
      dispatch({ type: SET_PATH, path: filePath });
      setWorkingDir(filePath);
    }
  };

  const run = () => {
    if (form) {
      triggerEvent(EVENT_EXECUTE_SNIPPET, { path, customSnippet });
    } else {
      triggerEvent(EVENT_RUN_SNIPPET, { path, currentSnippetId });
    }
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Running... it may take a while' });
  };

  const close = () => {
    setShowConfirmDiff(false);
    setShowDiff(false);
  };

  const showSnippetDiff = () => {
    close();
    dispatch({ type: SET_LOADING, loading: true });
    triggerEvent(EVENT_SHOW_SNIPPET_DIFF, { path });
  };

  const alwaysShowSnippetDiff = () => {
    selectShowDiffsAlwaysShow();
    showSnippetDiff();
  };

  const neverShowSnippetDiff = () => {
    selectShowDiffsNeverShow();
    close();
  };

  return (
    <>
      <div className="container-fluid mt-4 d-flex flex-row">
        <div className="input-group flex-grow-1">
          <div className="input-group-prepend">
            <label className="input-group-text">Workspace</label>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="directory path"
            value={path}
            readOnly
            onClick={selectPath}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={selectPath}
            >
              ...
            </button>
          </div>
        </div>
        <button className="btn btn-primary ml-2" disabled={!path || (form && customSnippet.length === 0)} onClick={run}>
          Run
        </button>
      </div>
      {showConfirmDiff && (
        <ConfirmDiffModal
          alwaysShowSnippetDiff={alwaysShowSnippetDiff}
          neverShowSnippetDiff={neverShowSnippetDiff}
          showSnippetDiff={showSnippetDiff}
          close={close}
        />
      )}
      {showDiff && (
        <ShowDiffModal
          snippet={snippet}
          diff={diff}
          close={close}
        />
      )}
    </>
  );
};
