const { ipcRenderer } = require("electron")

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import AppContext from './context'
import ListSnippets from './components/ListSnippets.jsx'
import ShowSnippet from './components/ShowSnippet.jsx'
import { EVENT_SNIPPETS_LOADED } from './constants'

const App = () => {
    const [snippets, setSnippets] = useState([])
    const [currentSnippet, setCurrentSnippet] = useState(null)
    const value = {
        snippets,
        currentSnippet,
        setSnippets,
        setCurrentSnippet
    }

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
                <div><ShowSnippet /></div>
            </div>
        </AppContext.Provider>
    )
}

function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render();