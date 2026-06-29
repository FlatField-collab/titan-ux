import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { STUDY_CONFIG } from "./tracker/StudyConfig";

// Read and apply study config from URL parameter BEFORE React mounts.
// We mutate STUDY_CONFIG's properties so every importer sees the overrides on first render.
try {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("study");
  if (encoded) {
    const decoded = JSON.parse(atob(encoded));
    if (decoded && typeof decoded === "object") {
      if (typeof decoded.studyId === "string") STUDY_CONFIG.studyId = decoded.studyId;
      if (typeof decoded.accessCode === "string") STUDY_CONFIG.accessCode = decoded.accessCode;
      if (typeof decoded.instructions === "string") STUDY_CONFIG.instructions = decoded.instructions;
      if (Array.isArray(decoded.tasks) && decoded.tasks.length) STUDY_CONFIG.tasks = decoded.tasks;
      // eslint-disable-next-line no-console
      console.log("[Titan UX] Study config loaded from URL:", STUDY_CONFIG);
    }
  }
} catch {
  // eslint-disable-next-line no-console
  console.warn("[Titan UX] Could not parse study URL parameter, using defaults.");
}

createRoot(document.getElementById("root")!).render(<App />);
