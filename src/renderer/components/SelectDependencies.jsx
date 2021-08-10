import React from "react";
import {
  DOCKER_DEPENDENCY,
  NATIVE_DEPENDENCY,
  selectDockerDependency,
  selectNativeDependency,
} from "../utils";

export default ({ setDependency }) => {
  const selectDocker = () => {
    selectDockerDependency();
    setDependency(DOCKER_DEPENDENCY);
  };
  const selectNative = () => {
    selectNativeDependency();
    setDependency(NATIVE_DEPENDENCY);
  };

  return (
    <div className="container">
      <div className="row mt-5 ml-5 mr-5">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Docker (recommended)</h5>
              <div className="card-text">
                <p>It will use docker image for all dependencies.</p>
                <p>Make sure you can connect to docker daemon.</p>
              </div>
              <div className="text-right">
                <button onClick={selectDocker} className="btn btn-primary">
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Native</h5>
              <div className="card-text">
                <p>It will your system ruby and synvert gem.</p>
                <p>Make sure you have permission to install synvert gem.</p>
              </div>
              <div className="text-right">
                <button onClick={selectNative} className="btn btn-primary">
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        Selection can be changed from menu Preferences later.
      </div>
    </div>
  );
};
