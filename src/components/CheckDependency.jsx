import React, { useEffect } from 'react'
import { EVENT_CHECK_DEPENDENCIES } from '../constants'

export default () => {
    useEffect(() => {
        const event = new CustomEvent(EVENT_CHECK_DEPENDENCIES, { detail: {} })
        document.dispatchEvent(event)
    })

    return (
       <div className="alert text-center">Checking dependencies...</div>
    )
}