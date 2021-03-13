import React from 'react'
import AppContext from '../context'

export default ({ selectPath }) => (
    <AppContext.Consumer>
        {({ path }) => (
            <div className="container-fluid mb-4">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <label className="input-group-text">Workspace</label>
                    </div>
                    <input type="text" className="form-control" placeholder="directory path" value={path} readOnly onClick={selectPath} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={selectPath}>
                            ...
                        </button>
                    </div>
                </div>
            </div>
        )}
    </AppContext.Consumer>
)