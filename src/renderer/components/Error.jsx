import React, { useContext } from "react";

import AppContext from "../context";
import { SET_ERROR } from "../constants";

export default () => {
  const { error, dispatch } = useContext(AppContext);

  const close = () => dispatch({ type: SET_ERROR, error: null });

  if (!error || error.length === 0) return null;
  return (
    <div className="alert alert-danger text-center">
      <span>{error}</span>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={close}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};
