import React, { useState, useEffect } from "react";

import { getSkipPaths, saveSkipPaths } from "../utils";

const FilesToExclude = () => {
  const [skipPaths, setSkipPaths] = useState("**/node_modules/**,**/dist/**");

  useEffect(() => {
    if (getSkipPaths()) {
      setSkipPaths(getSkipPaths());
    }
  }, [getSkipPaths()]);

  const handleSkipPathsChanged = (event) => {
    const skipPaths = event.target.value;
    setSkipPaths(skipPaths);
    saveSkipPaths(skipPaths);
  }

  return (
    <div className="form-group">
      <label>Files to exclude:</label>
      <input
        className="form-control"
        value={skipPaths}
        onChange={(e) => setSkipPaths(e.target.value)}
        onBlur={handleSkipPathsChanged}
      />
    </div>
  )
}

export default FilesToExclude;