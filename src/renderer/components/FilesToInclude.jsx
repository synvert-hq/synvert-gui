import React, { useContext, useState } from "react";

import AppContext from "../context";
import { SET_ONLY_PATHS } from "../constants";
import { saveOnlyPaths } from "../utils";

const FilesToInclude = () => {
  const { onlyPaths, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(onlyPaths);

  const handleValueChanged = (event) => {
    const onlyPaths = event.target.value;
    dispatch({ type: SET_ONLY_PATHS, onlyPaths });
    saveOnlyPaths(onlyPaths);
  }

  return (
    <div className="form-group">
      <label>Files to include:</label>
      <input
        className="form-control"
        placeholder="e.g. frontend/src"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleValueChanged}
      />
    </div>
  )
}

export default FilesToInclude;