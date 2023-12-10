import React, { useContext, useEffect } from "react";
import ReactDiffViewer, { DiffMethod } from "@xinminlabs/react-diff-viewer";

import AppContext from "../context";
import { replaceTestResult } from "synvert-ui-common";

const CodeDiff = () => {
  const { testResults, currentResultIndex, currentActionStart } = useContext(AppContext);
  const currentTestResult = testResults[currentResultIndex];
  if (!currentTestResult) return null;

  const fileSource = currentTestResult.fileSource;
  const lineNumber = fileSource ? fileSource.substring(0, currentActionStart).split("\n").length : 0;
  const newFileSource = replaceTestResult(currentTestResult, fileSource);

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
  );
};

export default CodeDiff;
