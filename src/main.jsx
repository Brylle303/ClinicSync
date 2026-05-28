import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ClinicSync from "./ClinicSync";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClinicSync />
    </BrowserRouter>
  </StrictMode>
);
