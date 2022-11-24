import React, { useContext } from "react";
import useEventListener from "@use-it/event-listener";
import toast from 'react-hot-toast';

import AppContext from "../context";
import {
  EVENT_SNIPPET_RUN,
  SET_LOADING,
  SET_TEST_RESULTS,
  SET_SHOW_TEST_RESULTS,
  EVENT_SNIPPET_TESTED,
} from "../constants";
import WorkingDir from "./WorkingDir";
import FilesToInclude from "./FilesToInclude";
import FilesToExclude from "./FilesToExclude";
import SearchButton from "./SearchButton";
import ReplaceButton from "./ReplaceButton";

export default () => {
  const { dispatch } = useContext(AppContext);

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

  return (
    <div className="run-snippet">
      <div className="container-fluid mt-3 d-flex flex-row">
        <WorkingDir />
        <SearchButton />
        <ReplaceButton />
      </div>
      <div className="container-fluid mt-3">
        <div className="form-row">
          <div className="col">
            <FilesToInclude />
          </div>
          <div className="col">
            <FilesToExclude />
          </div>
        </div>
      </div>
    </div>
  );
};
