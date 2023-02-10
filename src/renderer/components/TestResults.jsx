import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import ChevronRightSvg from "./svgs/chevron-right.svg";
import ChevronDownSvg from "./svgs/chevron-down.svg";
import ReplaceSvg from "./svgs/replace.svg";
import ReplaceAllSvg from "./svgs/replace-all.svg";
import CloseSvg from "./svgs/close.svg";
import {
  SET_SHOW_TEST_RESULTS,
  REMOVE_TEST_ACTION,
  REMOVE_TEST_RESULT,
  REPLACE_TEST_ACTION,
  REPLACE_TEST_RESULT,
  SET_CURRENT_RESULT_INDEX,
  SET_CURRENT_ACTION_INDEX,
} from "../constants";
import SnippetCode from "./SnippetCode";
import FilesToInclude from "./FilesToInclude";
import FilesToExclude from "./FilesToExclude";
import SearchButton from "./SearchButton";
import ReplaceAllButton from "./ReplaceAllButton";

const TestResults = () => {
  const { rootPath, testResults, currentResultIndex, currentActionIndex, dispatch } = useContext(AppContext);

  const [filesCollapse, setFilesCollapse] = useState({});

  useEffect(() => {
    if (testResults.length === 0) {
      dispatch({ type: SET_SHOW_TEST_RESULTS, showTestResults: false });
    }
  }, [testResults]);

  const toggleResult = (filePath) => {
    setFilesCollapse({
      ...filesCollapse,
      ...{ [filePath]: !filesCollapse[filePath] },
    });
  };

  const back = () => {
    dispatch({ type: SET_SHOW_TEST_RESULTS, showTestResults: false });
  };

  const replaceResult = (resultIndex) => {
    dispatch({ type: REPLACE_TEST_RESULT, rootPath, resultIndex });
  };

  const removeResult = (resultIndex) => {
    dispatch({ type: REMOVE_TEST_RESULT, resultIndex });
  };

  const replaceAction = (resultIndex, actionIndex) => {
    dispatch({ type: REPLACE_TEST_ACTION, rootPath, resultIndex, actionIndex });
  };

  const removeAction = (resultIndex, actionIndex) => {
    dispatch({ type: REMOVE_TEST_ACTION, resultIndex, actionIndex });
  };

  const resultClicked = (resultIndex) => {
    dispatch({ type: SET_CURRENT_RESULT_INDEX, resultIndex });
  };

  const actionClicked = (resultIndex, actionIndex, actionStart, actionEnd) => {
    dispatch({ type: SET_CURRENT_ACTION_INDEX, resultIndex, actionIndex, actionStart, actionEnd });
  };

  return (
    <div className="search-results">
      <button className="btn btn-sm btn-back" onClick={back}>
        &lt;&nbsp;Back
      </button>
      <div className="ml-3 mr-3">
        <SnippetCode rows={5} />
        <FilesToInclude />
        <FilesToExclude />
        <div className="d-flex justify-content-end">
          <SearchButton />
          <ReplaceAllButton />
        </div>
      </div>
      <ul className="mt-3">
        {testResults.map((result, resultIndex) => (
          <li key={resultIndex}>
            <div
              className={resultIndex === currentResultIndex && currentActionIndex === null ? "result active" : "result"}
              onClick={() => resultClicked(resultIndex)}
            >
              <a href="#" className="toggle-icon" onClick={() => toggleResult(result.filePath)}>
                {filesCollapse[result.filePath] ? <ChevronRightSvg /> : <ChevronDownSvg />}
              </a>
              <span title={result.filePath}>{result.filePath}</span>
              <div className="toolkit">
                {result.actions.every((action) => typeof action.newCode !== "undefined") && (
                  <a href="#" onClick={() => replaceResult(resultIndex)}>
                    <ReplaceAllSvg />
                  </a>
                )}
                <a href="#" onClick={() => removeResult(resultIndex)}>
                  <CloseSvg />
                </a>
              </div>
            </div>
            {!filesCollapse[result.filePath] && (
              <ul className="search-actions">
                {result.actions.map((action, actionIndex) => (
                  <li key={actionIndex}>
                    <div
                      className={
                        resultIndex === currentResultIndex && actionIndex === currentActionIndex
                          ? "action active"
                          : "action"
                      }
                      onClick={() => actionClicked(resultIndex, actionIndex, action.start, action.end)}
                    >
                      <div className="toolkit">
                        {typeof action.newCode !== "undefined" && (
                          <a href="#" onClick={() => replaceAction(resultIndex, actionIndex)}>
                            <ReplaceSvg />
                          </a>
                        )}
                        <a href="#" onClick={() => removeAction(resultIndex, actionIndex)}>
                          <CloseSvg />
                        </a>
                      </div>
                      {result.fileSource && (
                        <>
                          <span className="old-code">{result.fileSource.substring(action.start, action.end)}</span>
                          <span className="new-code">{action.newCode}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestResults;
