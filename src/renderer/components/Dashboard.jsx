import React, { useContext } from "react";
import useEventListener from "@use-it/event-listener";
import LoadingOverlay from "@murasoftware/react-loading-overlay";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import AppContext from "../context";
import ListSnippets from "./ListSnippets";
import ShowSnippet from "./ShowSnippet";
import RunSnippet from "./RunSnippet";
import SnippetForm from "./SnippetForm";
import TestResults from "./TestResults";
import {
  EVENT_SYNC_SNIPPETS,
  SET_LOADING,
} from "../constants";
import CodeDiff from "./CodeDiff";

export default () => {
  const { showForm, showTestResults, loading, loadingText, dispatch } = useContext(AppContext);

  useEventListener(
    EVENT_SYNC_SNIPPETS,
    () => { dispatch({ type: SET_LOADING, loading: true, loadingText: 'Syncing Snippets...' }) }
  );

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
