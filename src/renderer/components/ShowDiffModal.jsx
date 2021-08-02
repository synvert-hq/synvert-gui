import "diff2html/bundles/css/diff2html.min.css";
import React, { useContext, useState, useEffect } from "react";
import useEventListener from "@use-it/event-listener";
import * as Diff2Html from "diff2html";
import Prism from "prismjs";
import toast from 'react-hot-toast';

import AppContext from "../context";
import { triggerEvent } from "../utils";
import {
  EVENT_COMMIT_DIFF,
  EVENT_DIFF_COMMITTED,
} from "../constants";

export default ({ snippet, diff, close }) => {
  const [diffHtml, setDiffHtml] = useState("");
  const [showCommit, setShowCommit] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [committing, setCommitting] = useState(false);
  const { path } = useContext(AppContext);

  useEffect(() => {
    const diffHtml = Diff2Html.html(diff, {
      drawFileList: false,
      matching: "lines",
      outputFormat: "line-by-line",
    });
    setDiffHtml(diffHtml);
    setShowCommit(false);
    if (snippet) {
      setCommitMessage(
        snippet.name.replaceAll(/(\d+)_(\d+)/g, '$1.$2').replaceAll("_", " ")
      );
    }
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  });

  useEventListener(EVENT_DIFF_COMMITTED, ({ detail: { error } }) => {
    if (error) {
      toast.error(error);
    }
    setShowCommit(false);
    setCommitMessage("");
    setCommitting(false);
    close();
  });

  const commitNow = () => {
    setShowCommit(true);
  };

  const confirmCommit = () => {
    triggerEvent(EVENT_COMMIT_DIFF, { path, commitMessage });
    setCommitting(true);
  };

  return (
    <>
      <div
        className="modal fade show"
        data-backdrop="static"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-body">
              <div dangerouslySetInnerHTML={{ __html: diffHtml }} />
            </div>
            <div className="modal-footer d-flex flex-row">
              {showCommit ? (
                <>
                  <textarea
                    className="commit-message-input form-control flex-grow-1"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={committing}
                    onClick={confirmCommit}
                  >
                    {committing ? "Committing..." : "Confirm Commit"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={commitNow}
                >
                  Commit Now
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={close}
              >
                No, I'll commit by myself
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
