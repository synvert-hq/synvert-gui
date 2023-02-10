import React, { useContext } from "react";
import useEventListener from "@use-it/event-listener";
import toast from "react-hot-toast";

import AppContext from "../context";
import { EVENT_SNIPPET_RUN, SET_LOADING } from "../constants";
import WorkingDir from "./WorkingDir";
import FilesToInclude from "./FilesToInclude";
import FilesToExclude from "./FilesToExclude";
import SearchButton from "./SearchButton";
import ReplaceAllButton from "./ReplaceAllButton";

export default () => {
  const { dispatch } = useContext(AppContext);

  useEventListener(EVENT_SNIPPET_RUN, ({ detail: { affectedFiles, error } = {} }) => {
    dispatch({ type: SET_LOADING, loading: false });
    if (error) {
      toast.error(error);
      return;
    }
    if (!affectedFiles || affectedFiles.length == 0) {
      toast("No file affected by this snippet");
      return;
    }
  });

  return (
    <div className="run-snippet">
      <div className="container-fluid mt-3 d-flex flex-row align-items-center">
        <WorkingDir />
        <div className="actions">
          <SearchButton />
          <ReplaceAllButton />
        </div>
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
