import React from 'react'
import AppContext from '../context'

export default () => (
    <AppContext.Consumer>
        {({ path, currentSnippet, setPath, runSnippet }) => (
            <div className="d-flex align-items-center mb-4">
                <span>Workspace:</span>
                <div className="input-group input-group-lg ml-2 mr-2">
                    <input className="flex-grow-1 form-control" type="text" value={path} placeholder="directory path" onChange={(e) => setPath(e.target.value)} />
                </div>
                <button className="btn btn-primary" disabled={!path || !currentSnippet} onClick={runSnippet}>Run</button>
            </div>
        )}
    </AppContext.Consumer>
)