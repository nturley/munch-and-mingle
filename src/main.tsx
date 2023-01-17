import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No root element found");
} else {
  render(<App />, rootElement);
}
