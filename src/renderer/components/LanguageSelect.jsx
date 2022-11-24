import React, { useContext } from "react";

import AppContext from "../context";
import { LANGUAGES, SET_LANGUAGE } from "../constants";
import { saveLanguage } from "../utils";

const LanguageSelect = () => {
  const { language, dispatch } = useContext(AppContext);

  const handleLanguageChanged = (event) => {
    const language = event.target.value;
    dispatch({ type: SET_LANGUAGE, language });
    saveLanguage(language);
  }

  return (
    <div className="language-select d-flex justify-content-end mr-3 mb-2">
      <form className="form-inline">
        <label>Language:</label>
        <select className="form-control ml-2" value={language} onChange={handleLanguageChanged}>
          {LANGUAGES.map(language => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </form>
    </div>
  )
}

export default LanguageSelect;