import { useTracker } from "../Tracker";
import { UidGate } from "./UidGate";
import { TaskCard } from "./TaskCard";
import { TaskPill } from "./TaskPill";
import { CompletionScreen } from "./CompletionScreen";

export function UxOverlay() {
  const { phase } = useTracker();
  // Suppress the participant overlay when rendered inside the research
  // export-screens iframe (signaled via ?export=1). Keeps captures clean.
  if (
    typeof window !== "undefined" &&
    (window.location.search.includes("export=1") ||
      window.location.search.includes("flatten=1"))
  ) {
    return null;
  }

  if (phase === "uid") return <UidGate />;
  if (phase === "task-card") return <TaskCard />;
  if (phase === "in-task") return <TaskPill />;
  if (phase === "complete") return <CompletionScreen />;
  return null;
}
