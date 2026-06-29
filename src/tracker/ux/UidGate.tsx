import { useEffect, useState } from "react";
import { useTracker } from "../Tracker";
import { STUDY_CONFIG } from "../StudyConfig";

const DEFAULT_INSTRUCTIONS =
  "Thank you for participating. Work through each task naturally, as you would on the job. There are no right or wrong answers.";

export function UidGate() {
  const { beginStudy } = useTracker();
  const [pid, setPid] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const requiresCode = STUDY_CONFIG.accessCode.trim().length > 0;

  // Tiny delay so resume-from-IDB doesn't flash this modal.
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setChecked(true), 60);
    return () => window.clearTimeout(id);
  }, []);
  if (!checked) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pid.trim();
    if (!v) {
      setError("Please enter your participant ID");
      return;
    }
    if (requiresCode) {
      if (
        code.trim().toLowerCase() !== STUDY_CONFIG.accessCode.trim().toLowerCase()
      ) {
        setError("Incorrect access code — check your invitation and try again.");
        return;
      }
    }
    setError(null);
    beginStudy(v);
  };

  return (
    <div
      data-ux-ignore
      className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
    >
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <div className="inline-block rounded-md bg-[#009fdb] px-3 py-1 text-[13px] font-bold tracking-wide text-white">
            AT&amp;T
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            Titan UX
          </div>
        </div>
        <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.55] text-neutral-700">
          {STUDY_CONFIG.instructions || DEFAULT_INSTRUCTIONS}
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Participant ID
            </label>
            <input
              autoFocus
              value={pid}
              onChange={(e) => {
                setPid(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your ID"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#009fdb]"
            />
          </div>
          {requiresCode && (
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                Access code
              </label>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter access code"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#009fdb]"
              />
            </div>
          )}
          {error && (
            <p className="text-[12px] text-red-600">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-[#009fdb] py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start session
          </button>
        </form>
      </div>
    </div>
  );
}
