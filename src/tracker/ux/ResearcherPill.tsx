import { useTracker } from "../Tracker";

export function ResearcherPill() {
  const { session, started, phase, endAndDownload } = useTracker();
  if (!started || !session) return null;
  if (phase !== "in-task") return null;
  const count = session.interactions.length;
  return (
    <div
      data-ux-ignore
      className="fixed left-1/2 z-[2147483400] -translate-x-1/2"
      style={{ bottom: 56 }}
    >
      <div
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur-md"
        data-ux-ignore
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="opacity-90">{session.label || "anon"}</span>
        <span className="opacity-50">·</span>
        <span className="tabular-nums opacity-90">{count}</span>
        <span className="opacity-50">·</span>
        <button
          type="button"
          onClick={() => void endAndDownload()}
          className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-white/30"
          data-ux-ignore
        >
          End &amp; download
        </button>
      </div>
    </div>
  );
}
