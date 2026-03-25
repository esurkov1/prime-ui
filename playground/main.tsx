import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { PlaygroundApp } from "./PlaygroundApp";
import "./playground.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element in playground");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlaygroundApp />
    </BrowserRouter>
  </React.StrictMode>,
);
