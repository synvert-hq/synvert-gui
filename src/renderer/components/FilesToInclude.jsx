import React, { useState, useEffect } from "react";

import { getOnlyPaths, saveOnlyPaths } from "../utils";

const FilesToInclude = () => {
  const [onlyPaths, setOnlyPaths] = useState("");

  useEffect(() => {
    if (getOnlyPaths()) {
      setOnlyPaths(getOnlyPaths());
    }
  }, [getOnlyPaths()]);

  const handleOnlyPathsChanged = (event) => {
    const onlyPaths = event.target.value;
    setOnlyPaths(onlyPaths);
    saveOnlyPaths(onlyPaths);
  }

  return (
    <div className="form-group">
      <label>Files to include:</label>
      <input
        className="form-control"
        placeholder="e.g. frontend/src"
        value={onlyPaths}
        onChange={(e) => setOnlyPaths(e.target.value)}
        onBlur={handleOnlyPathsChanged}
      />
    </div>
  )
}

export default FilesToInclude;