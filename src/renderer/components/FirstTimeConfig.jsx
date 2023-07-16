import React, { useContext, useState } from "react";

import AppContext from "../context";
import { EVENT_CHECK_DEPENDENCIES, SET_INITED } from "../constants";
import { saveInited, saveLanguageEnabled, triggerEvent } from "../utils";

const FirstTimeConfig = () => {
  const { dispatch } = useContext(AppContext);

  const [rubyChecked, setRubyChecked] = useState(true);
  const [typescriptChecked, setTypescriptChecked] = useState(true);
  const [javascriptChecked, setJavascriptChecked] = useState(true);
  const [cssChecked, setCssChecked] = useState(true);
  const [lessChecked, setLessChecked] = useState(true);
  const [sassChecked, setSassChecked] = useState(true);
  const [scssChecked, setScssChecked] = useState(true);

  const handleRubyChange = () => setRubyChecked(!rubyChecked);
  const handleTypescriptChange = () => setTypescriptChecked(!typescriptChecked);
  const handleJavascriptChange = () => setJavascriptChecked(!javascriptChecked);
  const handleCssChange = () => setCssChecked(!cssChecked);
  const handleLessChange = () => setLessChecked(!lessChecked);
  const handleSassChange = () => setSassChecked(!sassChecked);
  const handleScssChange = () => setScssChecked(!scssChecked);

  const handleSubmit = () => {
    saveLanguageEnabled("ruby", rubyChecked);
    saveLanguageEnabled("typescript", typescriptChecked);
    saveLanguageEnabled("javascript", javascriptChecked);
    saveLanguageEnabled("css", cssChecked);
    saveLanguageEnabled("less", lessChecked);
    saveLanguageEnabled("sass", sassChecked);
    saveLanguageEnabled("scss", scssChecked);
    saveInited(true);
    triggerEvent(EVENT_CHECK_DEPENDENCIES);
    dispatch({ type: SET_INITED, inited: true });
  };

  return (
    <div className="container mt-8">
      <p>
        What programming language do you want to use? Synvert will ask you to install the dependencies.
        <br />
        (It can be chagned in the preferences later.)
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" checked={rubyChecked} onChange={handleRubyChange} />
          <label className="form-check-label">Ruby</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={typescriptChecked}
            onChange={handleTypescriptChange}
          />
          <label className="form-check-label">Typescript</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={javascriptChecked}
            onChange={handleJavascriptChange}
          />
          <label className="form-check-label">Javascript</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={cssChecked}
            onChange={handleCssChange}
          />
          <label className="form-check-label">Css</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={lessChecked}
            onChange={handleLessChange}
          />
          <label className="form-check-label">Less</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={sassChecked}
            onChange={handleSassChange}
          />
          <label className="form-check-label">Sass</label>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={scssChecked}
            onChange={handleScssChange}
          />
          <label className="form-check-label">Scss</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
};

export default FirstTimeConfig;
