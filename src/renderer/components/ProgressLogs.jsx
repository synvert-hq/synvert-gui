import React, { useState } from "react";
import useEventOnceListener from "../useEventOnceLlistener";

export default ({ type }) => {
  const [logs, setLogs] = useState({});

  useEventOnceListener(type, ({ detail: { id, name, status } }) => {
    const log = { [id]: { name, status } };
    setLogs({
      ...logs,
      ...log,
    });
  });

  return (
    <ul className="mt-5 list-unstyled">
      {Object.keys(logs)
        .sort()
        .map((id) => (
          <li key={id} className="mt-2 mb-2">
            {logs[id].name} {logs[id].status}
          </li>
        ))}
    </ul>
  );
};
