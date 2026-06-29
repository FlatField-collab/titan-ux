import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchSessions,
  fetchTargets,
  upsertTarget,
  type SessionRow,
  type TargetRow,
} from "./researchApi";

const ELIGIBLE_KEY = "ux:researchEligible";
const MODE_KEY = "ux:researchMode";

interface HeatPoint {
  x: number;
  y: number;
}

function currentViewName(): string {
  const el = document.querySelector("[data-view-name]") as HTMLElement | null;
  return el?.getAttribute("data-view-name") ?? "";
}

export default function ResearchOverlay() {
  const location = useLocation();
  const [eligible, setEligible] = useState<boolean>(
    () => typeof window !== "undefined" && sessionStorage.getItem(ELIGIBLE_KEY) === "1",
  );
  const [active, setActive] = useState<boolean>(
    () => typeof window !== "undefined" && sessionStorage.getItem(MODE_KEY) === "1",
  );
  const [viewName, setViewName] = useState<string>("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [taskOptions, setTaskOptions] = useState<{ key: string; title: string }[]>([]);
  const [selectedTaskKey, setSelectedTaskKey] = useState<string>("");
  const [target, setTarget] = useState<TargetRow | null>(null);

  // Mark eligibility when visiting /research
  useEffect(() => {
    if (location.pathname === "/research") {
      sessionStorage.setItem(ELIGIBLE_KEY, "1");
      setEligible(true);
    }
  }, [location.pathname]);

  // Re-read view name after each route change (delayed to wait for render)
  useEffect(() => {
    if (!eligible) return;
    const id = window.setTimeout(() => setViewName(currentViewName()), 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, eligible]);

  // Persist toggle
  useEffect(() => {
    if (!eligible) return;
    sessionStorage.setItem(MODE_KEY, active ? "1" : "0");
  }, [active, eligible]);

  // Fetch sessions once when activated
  useEffect(() => {
    if (!active || sessions.length) return;
    fetchSessions()
      .then((rows) => {
        setSessions(rows);
        const seen = new Map<string, string>();
        for (const r of rows) {
          for (const t of r.tasks ?? []) {
            const key = t.taskId || t.taskTitle;
            if (!seen.has(key)) seen.set(key, t.taskTitle);
          }
        }
        setTaskOptions(
          Array.from(seen.entries())
            .map(([key, title]) => ({ key, title }))
            .sort((a, b) => a.title.localeCompare(b.title)),
        );
      })
      .catch((e) => console.warn("[research] fetchSessions failed", e));
  }, [active, sessions.length]);

  // Load saved target for current task+view
  useEffect(() => {
    if (!active || !selectedTaskKey || !viewName) {
      setTarget(null);
      return;
    }
    fetchTargets(viewName)
      .then((rows) => {
        const match = rows.find((r) => r.task_key === selectedTaskKey) ?? null;
        setTarget(match);
      })
      .catch(() => setTarget(null));
  }, [active, selectedTaskKey, viewName]);

  // Heatmap points for current view
  const heatPoints = useMemo<HeatPoint[]>(() => {
    if (!active || !viewName) return [];
    const pts: HeatPoint[] = [];
    for (const s of sessions) {
      const list = s.interactions ?? [];
      let scrollOffset = 0;
      for (const ev of list) {
        if (ev.type === "scroll") {
          scrollOffset = (ev as { scrollY: number }).scrollY || 0;
        } else if (ev.type === "click" && ev.viewName === viewName) {
          const c = ev as { x: number; y: number };
          pts.push({ x: c.x, y: c.y + scrollOffset });
        }
      }
    }
    return pts;
  }, [active, sessions, viewName]);

  const captureRef = useRef<HTMLDivElement>(null);
  const handleCapture = useCallback(
    async (e: React.MouseEvent) => {
      if (!selectedTaskKey || !viewName) return;
      const x_pct = e.clientX / window.innerWidth;
      const y_pct = e.clientY / window.innerHeight;
      const row: TargetRow = {
        task_key: selectedTaskKey,
        view_name: viewName,
        x_pct,
        y_pct,
        radius_px: 28,
      };
      setTarget(row);
      try {
        await upsertTarget(row);
      } catch (err) {
        console.warn("[research] upsertTarget failed", err);
      }
    },
    [selectedTaskKey, viewName],
  );

  if (!eligible) return null;

  return (
    <div data-ux-ignore>
      {/* Heatmap layer */}
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 55,
          }}
        >
          {heatPoints.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x - 12,
                top: p.y - 12,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,0,0,0.55) 0%, rgba(255,0,0,0) 70%)",
              }}
            />
          ))}
        </div>
      )}

      {/* Saved target circle */}
      {active && target && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 56,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: target.x_pct * window.innerWidth - target.radius_px,
              top: target.y_pct * window.innerHeight - target.radius_px,
              width: target.radius_px * 2,
              height: target.radius_px * 2,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.35)",
              border: "2px solid rgba(59,130,246,0.8)",
            }}
          />
        </div>
      )}

      {/* Click capture for target placement */}
      {active && selectedTaskKey && (
        <div
          ref={captureRef}
          onClick={handleCapture}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "auto",
            zIndex: 57,
            cursor: "crosshair",
            background: "rgba(59,130,246,0.04)",
          }}
        />
      )}

      {/* Floating control pill */}
      <div
        style={{
          position: "fixed",
          right: 12,
          bottom: 84,
          zIndex: 60,
          background: "rgba(15,23,42,0.92)",
          color: "white",
          borderRadius: 999,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          maxWidth: "calc(100vw - 24px)",
          flexWrap: "wrap",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Research Mode
        </label>
        {active && (
          <>
            <span style={{ opacity: 0.6 }}>·</span>
            <span style={{ opacity: 0.8 }}>{viewName || "—"}</span>
            <select
              value={selectedTaskKey}
              onChange={(e) => setSelectedTaskKey(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                padding: "2px 6px",
                fontSize: 12,
                maxWidth: 180,
              }}
            >
              <option value="">— pick task —</option>
              {taskOptions.map((t) => (
                <option key={t.key} value={t.key} style={{ color: "black" }}>
                  {t.title}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
