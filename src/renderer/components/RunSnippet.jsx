import React, { useContext } from "react";
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
import { triggerEvent } from "../utils";
import WorkingDir from "./WorkingDir";
import FilesToInclude from "./FilesToInclude";
import FilesToExclude from "./FilesToExclude";

export default () => {
  const { rootPath, onlyPaths, skipPaths, snippetCode, dispatch } = useContext(AppContext);

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

  const search = () => {
    triggerEvent(EVENT_TEST_SNIPPET, { rootPath, snippetCode, onlyPaths, skipPaths });
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Searching... it may take a while' });
  };

  const replaceAll = () => {
    triggerEvent(EVENT_RUN_SNIPPET, { rootPath, snippetCode, onlyPaths, skipPaths });
    dispatch({ type: SET_LOADING, loading: true, loadingText: 'Running... it may take a while' });
  };

  return (
    <>
      <div className="container-fluid mt-4 d-flex flex-row">
        <WorkingDir />
        <button className="btn btn-primary ml-2" disabled={!rootPath || (snippetCode.length === 0)} onClick={search}>
          Search
        </button>
        <button className="btn btn-primary ml-2" disabled={!rootPath || (snippetCode.length === 0)} onClick={replaceAll}>
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
