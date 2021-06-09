import React, { useContext } from 'react'

import AppContext from '../context'

export default () => {
    const { error } = useContext(AppContext)

    if (!error || error.length === 0) return null
    return <div className="alert alert-danger text-center">{error}</div>
}