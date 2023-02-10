import React, { useContext } from "react";
import { SET_ROOT_PATH } from "../constants";

import AppContext from "../context";
import { getOnlyPaths, getSkipPaths, saveRootPath } from "../utils";

const WorkingDir = () => {
  const { rootPath, dispatch } = useContext(AppContext);

  const selectRootPath = async () => {
    const rootPath = await window.electronAPI.openFile();
    if (rootPath) {
      saveRootPath(rootPath);
      const onlyPaths = getOnlyPaths();
      const skipPaths = getSkipPaths();
      dispatch({ type: SET_ROOT_PATH, rootPath, onlyPaths, skipPaths });
    }
  };

  return (
    <div className="input-group flex-grow-1">
      <div className="input-group-prepend">
        <label className="input-group-text">Workspace</label>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder="directory path"
        value={rootPath}
        readOnly
        onClick={selectRootPath}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button" onClick={selectRootPath}>
          ...
        </button>
      </div>
    </div>
  );
};

export default WorkingDir;
