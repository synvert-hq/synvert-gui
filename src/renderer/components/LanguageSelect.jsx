import React, { useContext, useState } from "react";

import AppContext from "../context";
import { LANGUAGES, SET_LANGUAGE } from "../constants";
import { saveLanguage, languageEnabled, rubyEnabled, javascriptEnabled, typescriptEnabled, firstEnabledLanguage } from "../utils";

const LanguageSelect = () => {
  const { language, dispatch } = useContext(AppContext);

  const [update, setUpdate] = useState(false);

  let currentRubyEnabled = rubyEnabled();
  let currentJavascriptEnabled = javascriptEnabled();
  let currentTypescriptEnabled = typescriptEnabled();
  window.electronAPI.onPreferenceUpdated((e, preferences) => {
    if (!languageEnabled(language) && firstEnabledLanguage()) {
      dispatch({ type: SET_LANGUAGE, language: firstEnabledLanguage() });
      // FIXME: we supposed to save the first enabled language in preference,
      // but it will cause a loop to listen and trigger.
      // saveLanguage(firstEnabledLanguage());
    } else if (currentRubyEnabled !== rubyEnabled() || currentJavascriptEnabled !== javascriptEnabled() || currentTypescriptEnabled !== typescriptEnabled()) {
      currentRubyEnabled = rubyEnabled();
      currentJavascriptEnabled = javascriptEnabled();
      currentTypescriptEnabled = typescriptEnabled();
      // force rerender if one language is enabled or disabled.
      setUpdate(!update);
    }
  });

  const handleLanguageChanged = (event) => {
    const language = event.target.value;
    saveLanguage(language);
    dispatch({ type: SET_LANGUAGE, language });
  }

  return (
    <div className="language-select d-flex justify-content-end mr-3 mb-2">
      <form className="form-inline">
        <label>Language:</label>
        <select className="form-control ml-2" value={language} onChange={handleLanguageChanged}>
          {LANGUAGES.map(language => (
            languageEnabled(language) ? <option key={language} value={language}>{language}</option> : null
          ))}
        </select>
      </form>
    </div>
  )
}

export default LanguageSelect;