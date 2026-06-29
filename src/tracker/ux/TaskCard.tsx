import { useTracker } from "../Tracker";
import { STUDY_CONFIG } from "../StudyConfig";

const FALLBACK = "Complete the task described by your researcher.";

export function TaskCard() {
  const { currentTaskIndex, startTask } = useTracker();
  const tasks = STUDY_CONFIG.tasks;
  const task = tasks[currentTaskIndex];
  if (!task) return null;
  const instruction =
    task.instruction && task.instruction.trim().length > 0
      ? task.instruction
      : FALLBACK;
  const title = task.title || `Task ${currentTaskIndex + 1} of ${tasks.length}`;

  return (
    <div
      data-ux-ignore
      className="w-full border-b border-black/10 bg-white px-5 py-4 shadow-sm"
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col">
        <div className="flex justify-center gap-1.5">
          {tasks.map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  i === currentTaskIndex ? "#009fdb" : "#d6d8de",
              }}
            />
          ))}
        </div>
        <div
          className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "#7a7f8a" }}
        >
          {title}
        </div>
        <p
          className="mt-1.5 text-[15px]"
          style={{ color: "#1a1a1a", lineHeight: 1.5 }}
        >
          {instruction}
        </p>
        <button
          onClick={() => void startTask()}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-full bg-[#009fdb] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ borderRadius: 999 }}
        >
          Got it — start task
        </button>
      </div>
    </div>
  );
}
