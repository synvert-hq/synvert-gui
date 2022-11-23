import React, { useContext, useEffect, useState } from "react";
import useEventListener from "@use-it/event-listener";
import toast from 'react-hot-toast';

import AppContext from "../context";
import {
  EVENT_RUN_SNIPPET,
  EVENT_SNIPPET_RUN,
  SET_LOADING,
  SET_TEST_RESULTS,
  SET_SHOW_TEST_RESULTS,
  EVENT_TEST_SNIPPET,
  EVENT_SNIPPET_TESTED,
} from "../constants";
import {
  triggerEvent,
  saveWorkingDir,
  getWorkingDir,
  getOnlyPaths,
  getSkipPaths,
} from "../utils";
import FilesToInclude from "./FilesToInclude";
import FilesToExclude from "./FilesToExclude";

export default () => {
  const { snippetCode, dispatch } = useContext(AppContext);
  const [path, setPath] = useState("");

  useEffect(() => {
    if (getWorkingDir()) {
      setPath(getWorkingDir());
    }
  }, [getWorkingDir()]);

  useEventListener(
    EVENT_SNIPPET_TESTED,
    ({ detail: { testResults, error } = {} }) => {
      dispatch({ type: SET_LOADING, loading: false });
      if (error) {
        toast.error(error);
        return;
      }
      if (testResults.length === 0) {
        toast('No file affected by this snippet');
        return;
      }
      dispatch({ type: SET_TEST_RESULTS, testResults });
      dispatch({ type: SET_SHOW_TEST_RESULTS, showTestResults: true });
    }
  )

  useEventListener(
    EVENT_SNIPPET_RUN,
    ({ detail: { affectedFiles, error } = {} }) => {
      dispatch({ type: SET_LOADING, loading: false });
      if (error) {
        toast.error(error);
        return;
      }
      if (!affectedFiles || affectedFiles.length == 0) {
        toast('No file affected by this snippet');
        return;
      }
    }
  );

  const selectPath = async () => {
    const filePath = await window.electronAPI.openFile()
    if (filePath) {
      saveWorkingDir(filePath);
    }
  };

  const search = () => {
    const path = getWorkingDir();
    const onlyPaths = getOnlyPaths();
    const skipPaths = getSkipPaths();
    triggerEvent(EVENT_TEST_SNIPPET, { path, snippetCode, onlyPaths, skipPaths });
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Searching... it may take a while' });
  };

  const replaceAll = () => {
    const path = getWorkingDir();
    const onlyPaths = getOnlyPaths();
    const skipPaths = getSkipPaths();
    triggerEvent(EVENT_RUN_SNIPPET, { path, snippetCode, onlyPaths, skipPaths });
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Running... it may take a while' });
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
        <button className="btn btn-primary ml-2" disabled={!path || (snippetCode.length === 0)} onClick={search}>
          Search
        </button>
        <button className="btn btn-primary ml-2" disabled={!path || (snippetCode.length === 0)} onClick={replaceAll}>
          Replace
        </button>
      </div>
      <div className="container-fluid mt-2">
        <div className="form-row">
          <div className="col-md-6">
            <FilesToInclude />
          </div>
          <div className="col-md-6">
            <FilesToExclude />
          </div>
        </div>
      </div>
    </>
  );
};
