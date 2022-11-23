import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import { SET_SKIP_PATHS } from "../constants";
import { saveSkipPaths } from "../utils";

const FilesToExclude = () => {
  const { skipPaths, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(skipPaths);

  useEffect(() => setValue(skipPaths), [skipPaths]);

  const handleValueChanged = (event) => {
    const skipPaths = event.target.value;
    dispatch({ type: SET_SKIP_PATHS, skipPaths });
    saveSkipPaths(skipPaths);
  }

  return (
    <div className="form-group">
      <label>Files to exclude:</label>
      <input
        className="form-control"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleValueChanged}
      />
    </div>
  )
}

export default FilesToExclude;