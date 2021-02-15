const { ipcRenderer } = require("electron")

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import AppContext from './context'
import ListSnippets from './components/ListSnippets.jsx'
import { EVENT_SNIPPETS_LOADED } from './constants'

const App = () => {
    const [snippets, setSnippets] = useState([])
    const value = { snippets, setSnippets }

    useEffect(() => {
        ipcRenderer.on(EVENT_SNIPPETS_LOADED, (_event, message) => {
            setSnippets(message.snippets)
        })
    })

    return (
        <AppContext.Provider value={value}>
            <div className="container">
                <h1>Snippets</h1>
                <div><ListSnippets /></div>
            </div>
        </AppContext.Provider>
    )
}

function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render();