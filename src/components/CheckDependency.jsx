import React, { useEffect } from 'react'
import { EVENT_CHECK_DEPENDENCIES } from '../constants'

export default () => {
    useEffect(() => {
        document.dispatchEvent(new Event(EVENT_CHECK_DEPENDENCIES))
    })

    return (
       <div className="alert text-center">Checking dependencies...</div>
    )
}