const { dialog } = require('electron').remote

import React, { useContext } from 'react'
import useEventListener from '@use-it/event-listener'

import AppContext from '../context'
import { EVENT_RUN_SNIPPET, EVENT_SHOW_SNIPPET_DIFF, EVENT_SNIPPET_RUN, SET_LOADING, SET_ERROR } from '../constants'
import { triggerEvent } from '../utils'

export default () => {
    const { path, snippetsStore, currentSnippetId, dispatch } = useContext(AppContext)

    useEventListener(EVENT_SNIPPET_RUN, ({ detail: { error }}) => {
        dispatch({ type: SET_ERROR, error })
        if (error) {
            dispatch({ type: SET_LOADING, loading: false })
        } else {
            // wait 1 sec for affected_files
            setTimeout(() => {
                const affected_files = snippetsStore[currentSnippetId].affected_files
                if (affected_files.length > 0) {
                    triggerEvent(EVENT_SHOW_SNIPPET_DIFF, { affected_files, path })
                } else {
                    dispatch({ type: SET_LOADING, loading: false })
                }
            }, 1000)
        }
    })

    const selectPath = () => {
        const paths = dialog.showOpenDialogSync({
            properties: ['openDirectory', 'openFile']
        });
        if (paths) {
            dispatch({ type: SET_PATH, path: paths[0] });
            localStorage.setItem('path', paths[0]);
        }
    }

    const run = () => {
        triggerEvent(EVENT_RUN_SNIPPET, { path, currentSnippetId })
        dispatch({ type: SET_LOADING, loading: true })
    }

    return (
        <div className="container-fluid mt-4 d-flex flex-row">
            <div className="input-group flex-grow-1">
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
            <button className="btn btn-primary ml-2" disabled={!path} onClick={run}>Run</button>
        </div>
    )
}