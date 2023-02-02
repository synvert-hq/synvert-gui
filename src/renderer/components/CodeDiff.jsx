import React, { useContext, useEffect } from "react";
import ReactDiffViewer, { DiffMethod } from "@xinminlabs/react-diff-viewer";

import AppContext from "../context";
import { getNewSource } from "../utils";

const CodeDiff = () => {
  const { testResults, currentResultIndex, currentActionStart } = useContext(AppContext);
  const currentTestResult = testResults[currentResultIndex];
  if (!currentTestResult) return null;

  const fileSource = currentTestResult.fileSource;
  const lineNumber = fileSource.substring(0, currentActionStart).split("\n").length;
  const newFileSource = getNewSource(fileSource, currentTestResult);

  useEffect(() => {
    if (lineNumber && document.getElementById(String(lineNumber))) {
      document.getElementById(String(lineNumber)).scrollIntoView();
    }
  }, [lineNumber]);

  return (
    <div className="code-diff">
      <ReactDiffViewer
        oldValue={fileSource}
        newValue={newFileSource}
        useDarkTheme={true}
        compareMethod={DiffMethod.WORDS}
      />
    </div>
  )
}

export default CodeDiff;