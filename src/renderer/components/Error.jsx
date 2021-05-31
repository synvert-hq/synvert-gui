import React from 'react'

export default ({ error }) => {
    if (!error || error.length === 0) return null
    return <div className="alert alert-danger text-center">{error}</div>
}