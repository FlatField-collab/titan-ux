import { useEffect, useState } from "react";
import { useTracker } from "../Tracker";

function fmtTotal(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  if (mm === 0) return `${ss}s`;
  return `${mm}m ${ss}s`;
}

export function CompletionScreen() {
  const { session, submitSession } = useTracker();
  const [state, setState] = useState<"submitting" | "ok" | "error">(
    "submitting",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await submitSession();
        if (!cancelled) setState("ok");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submitSession]);

  const totalMs =
    (session?.tasks ?? []).reduce((sum, t) => sum + (t.durationMs || 0), 0);
  const taskCount = session?.tasks?.length ?? 0;
  const sessionShort = (session?.id ?? "").slice(0, 8);

  return (
    <div
      data-ux-ignore
      className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-white px-5"
    >
      <div className="w-full max-w-[360px] text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#009fdb] text-white">
          <span className="text-[26px] leading-none">✓</span>
        </div>
        <h1 className="mt-4 text-[22px] font-semibold text-neutral-900">
          All done — thank you!
        </h1>
        <p className="mt-2 text-[14px] text-neutral-500">
          Your session has been recorded. You can close this window.
        </p>
        <div className="mt-5 text-[12px] text-neutral-500">
          {taskCount} tasks · {fmtTotal(totalMs)} · Session {sessionShort}
        </div>

        {state === "error" && (
          <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-left text-[13px] text-amber-900">
            Having trouble saving your session. Please screenshot this screen
            and send it to your research team.
            <details className="mt-2">
              <summary className="cursor-pointer text-[12px] text-amber-800">
                Show session data
              </summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-2 text-[10px] text-neutral-800">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
