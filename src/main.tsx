import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./hooks/useTheme";

// Set before the first paint so the dock never flashes in over the intro.
document.body.classList.add("is-intro");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
