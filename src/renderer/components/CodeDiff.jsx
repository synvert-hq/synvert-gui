import React, { useContext } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

import AppContext from "../context";
import { getNewSource } from "../utils";

const CodeDiff = () => {
  const { testResults, currentResultIndex } = useContext(AppContext);
  const currentTestResult = testResults[currentResultIndex];
  if (!currentTestResult) return null;

  const fileSource = currentTestResult.fileSource;
  const newFileSource = getNewSource(fileSource, currentTestResult);

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