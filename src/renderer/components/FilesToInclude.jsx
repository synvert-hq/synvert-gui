import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import { SET_ONLY_PATHS } from "../constants";
import { saveOnlyPaths } from "../utils";

const FilesToInclude = () => {
  const { onlyPaths, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(onlyPaths);

  useEffect(() => setValue(onlyPaths), [onlyPaths]);

  const handleValueChanged = (event) => {
    const onlyPaths = event.target.value;
    dispatch({ type: SET_ONLY_PATHS, onlyPaths });
    saveOnlyPaths(onlyPaths);
  };

  return (
    <div className="d-flex align-items-center files-to-include">
      <label>Files to include:</label>
      <input
        className="form-control form-control-sm"
        placeholder="e.g. frontend/src"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleValueChanged}
      />
    </div>
  );
};

export default FilesToInclude;
