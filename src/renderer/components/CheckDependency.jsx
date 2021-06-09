import React, { useEffect } from 'react'
import { EVENT_CHECKING_DEPENDENCIES, EVENT_CHECK_DEPENDENCIES } from '../constants'
import ProgressLogs from './ProgressLogs'
import { triggerEvent } from '../utils'

export default () => {
    useEffect(() => {
        triggerEvent(EVENT_CHECK_DEPENDENCIES)
    })

    return (
        <div className="container">
            <h4 className="text-center">Checking dependencies</h4>
            <ProgressLogs type={EVENT_CHECKING_DEPENDENCIES} />
        </div>
    )
}