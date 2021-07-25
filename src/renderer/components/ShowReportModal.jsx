import React, { useState } from "react";

import { host } from '../utils'

export default ({ id, defaultReason, close }) => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState(defaultReason);
  const [reporting, setReporting] = useState(false);

  const report = async () => {
    setReporting(true)
    const response = await fetch(`${host()}/api/v1/report`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email, reason }),
    });
    await response.json();
    setReporting(false)
    close();
  };

  return (
    <>
      <div
        className="modal fade show"
        data-backdrop="static"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Report</h4>
              <button type="button" className="close" onClick={close}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email: <small className="text-muted">(We will let you know after we improve our algorithm)</small></label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Reason:</label>
                <textarea className="form-control" rows="3" value={reason} onChange={e => setReason(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                disabled={email === '' || reason === '' || reporting}
                onClick={report}
              >
                {reporting ? 'Reporting...' : 'Rerpot'}
              </button>
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
