const { dialog } = require('electron').remote

import React, { useContext, useState } from 'react'
import useEventListener from '@use-it/event-listener'

import AppContext from '../context'
import { EVENT_RUN_SNIPPET, EVENT_SNIPPET_RUN, EVENT_SHOW_SNIPPET_DIFF, EVENT_SNIPPET_DIFF_SHOWN, SET_PATH, SET_LOADING, SET_ERROR } from '../constants'
import { triggerEvent, showDiffsSelected, showDiffsAskMeSelected, showDiffsAlwaysShowSelected, selectShowDiffsAlwaysShow, selectShowDiffsNeverShow } from '../utils'
import ConfirmDiffModal from './ConfirmDiffModal'
import ShowDiffModal from './ShowDiffModal'

export default () => {
    const { path, snippetsStore, currentSnippetId, dispatch } = useContext(AppContext)
    const [affectedFiles, setAffectedFiles] = useState([])
    const [showConfirmDiff, setShowConfirmDiff] = useState(false)
    const [showDiff, setShowDiff] = useState(false)
    const [diff, setDiff] = useState('')
    const snippet = snippetsStore[currentSnippetId]

    useEventListener(EVENT_SNIPPET_DIFF_SHOWN, ({ detail: { diff, error } }) => {
        dispatch({ type: SET_LOADING, loading: false })
        if (error) {
            dispatch({ type: SET_ERROR, loading: error })
            return
        }
        if (diff) {
            setDiff(diff)
            setShowDiff(true)
        }
    })

    useEventListener(EVENT_SNIPPET_RUN, ({ detail: { affectedFiles, error } = {} }) => {
        setAffectedFiles(affectedFiles)
        dispatch({ type: SET_LOADING, loading: false })
        if (error) {
            dispatch({ type: SET_ERROR, error })
            return
        }
        if (!affectedFiles || affectedFiles.length == 0) return;

        if (showDiffsAlwaysShowSelected()) {
            dispatch({ type: SET_LOADING, loading: true })
            triggerEvent(EVENT_SHOW_SNIPPET_DIFF, { affectedFiles, path })
        } else if (!showDiffsSelected() || showDiffsAskMeSelected()) {
            setShowConfirmDiff(true)
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

    const close = () => {
        setShowConfirmDiff(false)
        setShowDiff(false)
    }

    const showSnippetDiff = () => {
        close()
        if (affectedFiles.length > 0) {
            dispatch({ type: SET_LOADING, loading: true })
            triggerEvent(EVENT_SHOW_SNIPPET_DIFF, { affectedFiles, path })
        }
    }

    const alwaysShowSnippetDiff = () => {
        selectShowDiffsAlwaysShow()
        showSnippetDiff()
    }

    const neverShowSnippetDiff = () => {
        selectShowDiffsNeverShow()
        close()
    }

    return (
        <>
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
            {showConfirmDiff && <ConfirmDiffModal alwaysShowSnippetDiff={alwaysShowSnippetDiff} neverShowSnippetDiff={neverShowSnippetDiff} showSnippetDiff={showSnippetDiff} close={close} />}
            {showDiff && <ShowDiffModal snippet={snippet} affectedFiles={affectedFiles} diff={diff} close={close} />}
        </>
    )
}