import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import { SET_SKIP_PATHS } from "../constants";
import { saveSkipPaths } from "../utils";

const DEFAULT_JAVASCRIPT_SKIP_PATHS = "**/node_modules/**,**/dist/**,public/packs/**,public/packs-test/**,tmp/**";

const FilesToExclude = () => {
  const { skipPaths, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(skipPaths || DEFAULT_JAVASCRIPT_SKIP_PATHS);

  useEffect(() => setValue(skipPaths), [skipPaths]);

  const handleValueChanged = (event) => {
    const skipPaths = event.target.value;
    dispatch({ type: SET_SKIP_PATHS, skipPaths });
    saveSkipPaths(skipPaths);
  }

  return (
    <div className="d-flex align-items-center files-to-include">
      <label>Files to exclude:</label>
      <input
        className="form-control form-control-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleValueChanged}
      />
    </div>
  )
}

export default FilesToExclude;