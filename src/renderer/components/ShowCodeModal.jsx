import React, { useEffect } from "react";
import Prism from "prismjs";

export default ({ snippet, code, close }) => {
  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <>
      <div
        className="modal fade show"
        data-backdrop="static"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {snippet.group}/{snippet.name}
              </h5>
              <button type="button" className="close" onClick={close}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <pre className="language-ruby">
                <code className="language-ruby">{code}</code>
              </pre>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={close}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
