import React from 'react'
import AppContext from '../context'

export default () => (
    <AppContext.Consumer>
        {({ path, currentSnippet, setPath, runSnippet }) => (
            <div className="header">
                <input type="text" value={path} onChange={(e) => setPath(e.target.value)} />
                <button disabled={!path || !currentSnippet} onClick={runSnippet}>Run</button>
            </div>
        )}
    </AppContext.Consumer>
)