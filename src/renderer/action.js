import { removeTestAction, removeTestResult, replaceAllTestResults, replaceTestAction, replaceTestResult } from "synvert-ui-common";
import { REMOVE_TEST_ACTION, REMOVE_TEST_RESULT, REPLACE_ALL_TEST_RESULTS, REPLACE_TEST_ACTION, REPLACE_TEST_RESULT, SET_TEST_RESULTS, UPDATE_TEST_RESULTS } from "./constants";

export default ({
  [REMOVE_TEST_ACTION]: ({ dispatch }) => async (action) => {
    const { testResults, resultIndex, actionIndex } = action;
    const results = removeTestAction(testResults, resultIndex, actionIndex);
    dispatch({
      type: UPDATE_TEST_RESULTS,
      testResults: results,
    });
  },
  [REPLACE_TEST_ACTION]: ({ dispatch }) => async (action) => {
    const { testResults, resultIndex, actionIndex, rootPath } = action;
    const results = await replaceTestAction(testResults, resultIndex, actionIndex, window.electronAPI.pathAPI, window.electronAPI.promiseFsAPI);
    dispatch({
      type: UPDATE_TEST_RESULTS,
      testResults: results,
    });
  },
  [REMOVE_TEST_RESULT]: ({ dispatch }) => async (action) => {
    const { testResults, resultIndex } = action;
    const results = removeTestResult(testResults, resultIndex);
    dispatch({
      type: UPDATE_TEST_RESULTS,
      testResults: results,
    });
  },
  [REPLACE_TEST_RESULT]: ({ dispatch }) => async (action) => {
    const { testResults, resultIndex, rootPath } = action;
    const results = await replaceTestResult(testResults, resultIndex, window.electronAPI.pathAPI, window.electronAPI.promiseFsAPI);
    dispatch({
      type: UPDATE_TEST_RESULTS,
      testResults: results,
    });
  },
  [REPLACE_ALL_TEST_RESULTS]: ({ dispatch }) => async (action) => {
    const { testResults, rootPath } = action;
    const results = await replaceAllTestResults(testResults, window.electronAPI.pathAPI, window.electronAPI.promiseFsAPI);
    dispatch({
      type: SET_TEST_RESULTS,
      testResults: results,
    });
  },
});
