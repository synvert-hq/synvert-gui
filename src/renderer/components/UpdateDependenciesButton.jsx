import React, { useContext, useState } from "react";
import useEventListener from "@use-it/event-listener";

import AppContext from "../context";
import { EVENT_DEPENDENCIES_UPDATED, EVENT_UPDATE_DEPENDENCIES } from "../constants";
import { triggerEvent } from "../utils";

const UpdateDependenciesButton = () => {
  const { language } = useContext(AppContext);
  const [updateDependenciesButtonDisabled, setUpdateDependenciesButtonDisabled] = useState(false);

  const title =
    language === "ruby"
      ? "Update synvert ruby dependencies and sync synvert ruby snippets"
      : "Update synvert javascript dependencies and sync synvert javascript snippets";
  const text = updateDependenciesButtonDisabled ? "Updating..." : "Update";

  const updateDependencies = () => {
    setUpdateDependenciesButtonDisabled(true);
    triggerEvent(EVENT_UPDATE_DEPENDENCIES, { language });
  };

  useEventListener(EVENT_DEPENDENCIES_UPDATED, () => {
    setUpdateDependenciesButtonDisabled(false);
  });

  return (
    <button
      type="button"
      className="btn btn-primary btm-sm"
      onClick={updateDependencies}
      disabled={updateDependenciesButtonDisabled}
      title={title}
    >
      {text}
    </button>
  );
};

export default UpdateDependenciesButton;
