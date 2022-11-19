import React, { useContext } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

import AppContext from "../context";

const CodeDiff = () => {
  const { testResults, currentResultIndex, dispatch } = useContext(AppContext);
  const currentTestResult = testResults[currentResultIndex];
  const fileSource = currentTestResult.fileSource;
  let newFileSource = fileSource;
  currentTestResult.actions.reverse().forEach(action => {
    newFileSource = newFileSource.slice(0, action.start) + action.newCode + newFileSource.slice(action.end);
  });

  console.log(fileSource)
  console.log(newFileSource)
  return (
    <ReactDiffViewer
      oldValue={fileSource}
      newValue={newFileSource}
      useDarkTheme={true}
      compareMethod={DiffMethod.WORDS}
    />
  )
}

export default CodeDiff;