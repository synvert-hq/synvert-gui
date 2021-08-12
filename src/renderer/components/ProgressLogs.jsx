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
    <div className="ml-4 mr-4">
      <ul className="list-unstyled">
        {Object.keys(logs)
          .sort()
          .map((id) => (
            <li key={id} className="mt-2 mb-2">
              {logs[id].name} {logs[id].status}
            </li>
          ))}
      </ul>
    </div>
  );
};
