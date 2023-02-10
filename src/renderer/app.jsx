import "bootstrap/dist/css/bootstrap.min.css";
import "@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css";

import React from "react";
import ReactDOM from "react-dom";

import AppProvider from "./provider";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

const App = () => (
  <AppProvider>
    <Dashboard />
    <Toaster position="top-right" />
  </AppProvider>
);

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render();

if (module.hot) {
  module.hot.accept();
}
