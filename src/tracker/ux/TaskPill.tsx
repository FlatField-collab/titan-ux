import { useEffect, useState } from "react";
import { useTracker } from "../Tracker";
import { STUDY_CONFIG } from "../StudyConfig";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function TaskPill() {
  const { currentTaskIndex, taskStartAt, completeTask } = useTracker();
  const task = STUDY_CONFIG.tasks[currentTaskIndex];
  const [now, setNow] = useState(Date.now());
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!task) return null;
  const elapsed = taskStartAt ? now - taskStartAt : 0;

  return (
    <>
      <div
        data-ux-ignore
        className="w-full border-b border-white/10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      >
        <div className="mx-auto flex h-[44px] w-full max-w-[720px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="Show task instruction"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white text-[12px] font-bold leading-none text-white"
            data-ux-ignore
          >
            ?
          </button>
          <div
            className="truncate px-2 text-[12px] font-medium text-white"
            data-ux-ignore
          >
            {task.title}
          </div>
          <div className="flex items-center gap-2" data-ux-ignore>
            <span
              className="text-[11px] tabular-nums text-white"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              data-ux-ignore
            >
              {fmt(elapsed)}
            </span>
            <button
              type="button"
              onClick={() => void completeTask()}
              className="flex h-7 items-center rounded-full border border-white px-3 text-[11px] font-semibold text-white"
              data-ux-ignore
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
        <SheetContent
          side="bottom"
          data-ux-ignore
          className="rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "#7a7f8a" }}
            >
              {task.title}
            </SheetTitle>
          </SheetHeader>
          <p
            className="mt-3 text-[15px]"
            style={{ color: "#1a1a1a", lineHeight: 1.6 }}
          >
            {task.instruction && task.instruction.trim().length > 0
              ? task.instruction
              : "Complete the task described by your researcher."}
          </p>
          <button
            type="button"
            onClick={() => setHelpOpen(false)}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-[14px] font-semibold text-white"
            data-ux-ignore
          >
            Close
          </button>
        </SheetContent>
      </Sheet>
    </>
  );
}
