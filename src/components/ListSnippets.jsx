const { ipcRenderer } = require("electron")

import React, { useEffect, useState } from 'react'
import { EVENT_SNIPPETS_LOADED } from '../constants'

const ListSnippets = () => {
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [snippets, setSnippets] = useState([])

    useEffect(() => {
        ipcRenderer.on(EVENT_SNIPPETS_LOADED, (_event, message) => {
            setLoading(false)
            setLoaded(true)
            setSnippets(message.snippets)
        })
    })

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <ul>
            {snippets.map(snippet => (
                <li>
                    {snippet}
                </li>
            ))}
        </ul>
    )
}

export default ListSnippets