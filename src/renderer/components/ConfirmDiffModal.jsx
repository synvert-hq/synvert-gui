import React from "react";

export default ({ close, triggerShowSnippetDiffEvent }) => {
  return (
    <>
      <div
        className="modal fade show"
        data-backdrop="static"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Show Code Diffs?</h5>
            </div>
            <div className="modal-body">
              Some of your files have been changed after running the snippet, do
              you want to review the code diffs?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={triggerShowSnippetDiffEvent}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={close}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
