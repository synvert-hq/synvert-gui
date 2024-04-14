import React, { useContext } from "react";
import useEventListener from "@use-it/event-listener";
import LoadingOverlay from "@murasoftware/react-loading-overlay";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import AppContext from "../context";
import { getInited, showMessage } from "../utils";
import { SET_LOADING, SET_TEST_RESULTS, SET_SHOW_TEST_RESULTS, EVENT_SNIPPET_TESTED } from "../constants";
import FirstTimeConfig from "./FirstTimeConfig";
import ListSnippets from "./ListSnippets";
import ShowSnippet from "./ShowSnippet";
import RunSnippet from "./RunSnippet";
import SnippetForm from "./SnippetForm";
import TestResults from "./TestResults";
import CodeDiff from "./CodeDiff";

export default () => {
  const { dispatch, showForm, showTestResults, loading, loadingText } = useContext(AppContext);
  const inited = getInited();

  if (!inited) {
    return <FirstTimeConfig />;
  }

  useEventListener(EVENT_SNIPPET_TESTED, ({ detail: { testResults, error } = {} }) => {
    dispatch({ type: SET_LOADING, loading: false });
    if (error) {
      showMessage(error);
      return;
    }
    if (testResults.length === 0) {
      showMessage("No file affected by this snippet");
      return;
    }
    dispatch({ type: SET_TEST_RESULTS, testResults });
    dispatch({ type: SET_SHOW_TEST_RESULTS, showTestResults: true });
  });

  return (
    <LoadingOverlay active={loading} text={loadingText} spinner>
      {showTestResults ? (
        <Allotment>
          <Allotment.Pane preferredSize={400}>
            <TestResults />
          </Allotment.Pane>
          <Allotment.Pane>
            <CodeDiff />
          </Allotment.Pane>
        </Allotment>
      ) : (
        <Allotment>
          <Allotment.Pane preferredSize={400}>
            <ListSnippets />
          </Allotment.Pane>
          <Allotment.Pane>
            {showForm ? <SnippetForm /> : <ShowSnippet />}
            <RunSnippet />
          </Allotment.Pane>
        </Allotment>
      )}
    </LoadingOverlay>
  );
};
