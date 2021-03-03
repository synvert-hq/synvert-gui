import React from 'react'
import { DOCKER_DEPENDENCY, NATIVE_DEPENDENCY, selectDockerDependency, selectNativeDependency } from '../utils'

export default ({ setDependency }) => {
    const selectDocker = () => {
        selectDockerDependency()
        setDependency(DOCKER_DEPENDENCY)
    }
    const selectNative = () => {
        selectNativeDependency()
        setDependency(NATIVE_DEPENDENCY)
    }

    return (
        <div className="row mt-5 ml-5 mr-5">
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Docker (recommended)</h5>
                        <p className="card-text">It will use docker image for all dependencies.</p>
                        <div className="text-right">
                            <button onClick={selectDocker} className="btn btn-primary">Select</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Native</h5>
                        <p className="card-text">It will your system ruby and synvert gem.</p>
                        <div className="text-right">
                            <button onClick={selectNative} className="btn btn-primary">Select</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}