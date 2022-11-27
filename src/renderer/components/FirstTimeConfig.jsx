import React, { useContext, useState } from "react";

import AppContext from "../context";
import { SET_INITED } from "../constants";
import { saveInited, saveLanguageEnabled } from "../utils";

const FirstTimeConfig = () => {
  const { dispatch } = useContext(AppContext);

  const [rubyChecked, setRubyChecked] = useState(true);
  const [typescriptChecked, setTypescriptChecked] = useState(true);
  const [javascriptChecked, setJavascriptChecked] = useState(true);

  const handleRubyChange = () => setRubyChecked(!rubyChecked);
  const handleTypescriptChange = () => setTypescriptChecked(!typescriptChecked);
  const handleJavascriptChange = () => setJavascriptChecked(!javascriptChecked);

  const handleSubmit = () => {
    saveLanguageEnabled("ruby", rubyChecked);
    saveLanguageEnabled("typescript", typescriptChecked);
    saveLanguageEnabled("javascript", javascriptChecked);
    saveInited(true);
    dispatch({ type: SET_INITED, inited: true });
  }

  return (
    <div className="container mt-4">
      <p>
        What programming language do you want to use? It will ask you to install the dependencies.
        <br/>
        (It can be chagned in the preferences later.)
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" checked={rubyChecked} onChange={handleRubyChange} />
          <label className="form-check-label">Ruby</label>
        </div>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" checked={typescriptChecked} onChange={handleTypescriptChange} />
          <label className="form-check-label">Typescript</label>
        </div>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" checked={javascriptChecked} onChange={handleJavascriptChange}  />
          <label className="form-check-label">Javascript</label>
        </div>
        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </div>
  )
}

export default FirstTimeConfig;