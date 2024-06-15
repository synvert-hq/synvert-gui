import React, { useContext, useEffect, useState } from "react";

import AppContext from "../context";
import { SET_RESPECT_GITIGNORE } from "../constants";
import { saveRespectGitignore } from "../utils";

const RespectGitignoreCheckbox = () => {
  const { respectGitignore, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(respectGitignore);

  useEffect(() => setValue(respectGitignore), [respectGitignore]);

  const handleValueChanged = (event) => {
    const respectGitignore = event.target.checked;
    dispatch({ type: SET_RESPECT_GITIGNORE, respectGitignore });
    saveRespectGitignore(respectGitignore);
  };

  return (
    <label htmlFor="respectGitignore">
      <input id="respectGitignore" type="checkbox" checked={value} onChange={handleValueChanged} />
      Respect .gitignore
    </label>
  );
};

export default RespectGitignoreCheckbox;
