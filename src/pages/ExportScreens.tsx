// Dev-only screen exporter for researchers. Not linked from the participant UI.
// Renders each app route inside a 393px-wide iframe, waits for data to settle,
// then captures the full scrollable content via html2canvas at scale: 1 and
// downloads it as `{viewName}.png` using the same viewName the click tracker logs.

import { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas";

type Status = "pending" | "running" | "done" | "error";

interface ScreenEntry {
  // viewName used by the click tracker for this route (resolveViewName order:
  // [data-view-name] ancestor > open dialog aria-label > first h1/h2 > document.title).
  viewName: string;
  path: string;
  label: string;
}

// Mirrors the <Route> entries in src/App.tsx. Routes that resolve to the same
// viewName intentionally share a filename — the tracker logs them under one
// name and the exporter follows suit.
const SCREENS: ScreenEntry[] = [
  { viewName: "Dashboard", path: "/dashboard", label: "Dashboard (/)" },
  { viewName: "Jobs", path: "/team", label: "Team / Jobs" },
  { viewName: "Docs", path: "/docs", label: "Docs" },
  { viewName: "Docs Detail", path: "/docs/1", label: "Docs Detail" },
  { viewName: "Docs Detail", path: "/visits/1", label: "Visit Detail" },
  { viewName: "Job Detail", path: "/team/tech-1", label: "Job Detail" },
  { viewName: "Performance", path: "/performance", label: "Performance" },
  { viewName: "Competencies", path: "/competencies", label: "Competencies" },
  { viewName: "Chat", path: "/chat/general", label: "Chat" },
  { viewName: "Tech Detail", path: "/tech/tech-1", label: "Tech Detail" },
  { viewName: "Tech Detail", path: "/tech/tech-1/vehicle", label: "Tech Vehicle" },
  { viewName: "Map", path: "/map", label: "Map" },
  { viewName: "Map", path: "/map/filters", label: "Map Filters" },
  { viewName: "TechLocation", path: "/techlocation", label: "Tech Location" },
  { viewName: "RouteTrail", path: "/map/trail", label: "Route Trail" },
  { viewName: "VRide", path: "/vride", label: "vRide" },
  { viewName: "News", path: "/news", label: "News" },
  { viewName: "NewsArticle", path: "/news/happy-250th-birthday", label: "News Article" },
];

const CAPTURE_WIDTH = 393;
const SETTLE_MS = 1500;
const BETWEEN_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function ExportScreens() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);

  const setStatus = (i: number, s: Status) =>
    setStatuses((prev) => ({ ...prev, [i]: s }));

  const captureOne = useCallback(async (idx: number) => {
    const entry = SCREENS[idx];
    setCurrentIdx(idx);
    setStatus(idx, "running");

    const frame = frameRef.current;
    if (!frame) {
      setStatus(idx, "error");
      return;
    }

    // Navigate the iframe to the target route.
    await new Promise<void>((resolve) => {
      const onLoad = () => {
        frame.removeEventListener("load", onLoad);
        resolve();
      };
      frame.addEventListener("load", onLoad);
      const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const sep = entry.path.includes("?") ? "&" : "?";
      frame.src = `${base}${entry.path}${sep}export=1`;
    });

    // Allow data fetching / async render to settle.
    await sleep(SETTLE_MS);

    try {
      const doc = frame.contentDocument;
      const win = frame.contentWindow;
      if (!doc || !win) throw new Error("iframe doc unavailable");

      // Neutralize the phone-frame chrome that every page wraps itself in:
      // - outer `py-6` dark padding
      // - inner 393px card with rounded corners, border, shadow
      // - fixed-height `<main className="h-[852px] overflow-y-auto">` that
      //   clips real content to one viewport and makes exports look "bunched".
      // Live participant view is unaffected — this stylesheet only exists
      // inside the export iframe.
      // Neutralize the phone-frame chrome that every page wraps itself in:
      // - outer `py-6` dark padding
      // - inner card: rounded corners + shadow (visually a phone bezel)
      // - fixed-height `<main className="h-[852px] overflow-y-auto">` that
      //   clips real content to one viewport and makes exports look "bunched".
      //
      // CRITICAL: the inner card has `border border-white/5` (1px each side).
      // We must NOT strip that border or the inner content area widens by 2px
      // and every w-full descendant (status grid, member cards, etc.) lays
      // out 2px wider than in the live build. Keep the border but make it
      // transparent so it's invisible while still consuming the 2px the
      // live layout reserves for it.
      //
      // Live participant view is unaffected — this stylesheet only exists
      // inside the export iframe.
      const styleEl = doc.createElement("style");
      styleEl.setAttribute("data-export-reset", "");
      styleEl.textContent = `
        html, body { background: #F2F2F6 !important; }
        [data-view-name] { padding: 0 !important; background: #F2F2F6 !important; }
        [data-view-name] > div {
          border-radius: 0 !important;
          border-color: transparent !important;
          box-shadow: none !important;
          min-height: 0 !important;
          max-width: none !important;
          width: 393px !important;
        }
        [data-view-name] main {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }
      `;
      doc.head.appendChild(styleEl);
      // Let layout reflow with the reset applied.
      await sleep(120);

      // Wait for all <img> in the iframe to finish loading (or fail) so avatars
      // don't render as gray fallback circles. Timeout per image so one broken
      // asset can't hang the export.
      const imgs = Array.from(doc.images);
      await Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            const done = () => {
              img.removeEventListener("load", done);
              img.removeEventListener("error", done);
              resolve();
            };
            img.addEventListener("load", done);
            img.addEventListener("error", done);
            setTimeout(done, 3000);
          });
        }),
      );

      // Measure full scrollable height inside the iframe's own 393px viewport,
      // then resize the iframe element itself so html2canvas captures everything
      // without the outer page width ever affecting layout.
      const html = doc.documentElement;
      const body = doc.body;
      const fullHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
      frame.style.height = `${fullHeight}px`;
      // Let the iframe settle at the new height before rasterizing.
      await sleep(150);

      // Re-pin BottomNav to the true bottom of the tall capture. html2canvas
      // renders position:fixed elements at their viewport coords, which lands
      // mid-image on long pages. Swap to absolute for the capture, restore after.
      const nav = doc.querySelector<HTMLElement>(
        'nav[data-track-region="sidebar"]',
      );
      const navSaved = nav
        ? {
            position: nav.style.position,
            top: nav.style.top,
            bottom: nav.style.bottom,
          }
        : null;
      if (nav) {
        const navH = nav.getBoundingClientRect().height;
        nav.style.position = "absolute";
        nav.style.top = `${fullHeight - navH - 6}px`;
        nav.style.bottom = "auto";
      }

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(html, {
          width: CAPTURE_WIDTH,
          height: fullHeight,
          windowWidth: CAPTURE_WIDTH,
          windowHeight: fullHeight,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
          scrollX: 0,
          scrollY: 0,
          // Strip any participant chrome (TaskPill/TaskCard/UidGate/etc.) from
          // exports. Every such element carries data-ux-ignore.
          ignoreElements: (el: Element) =>
            (typeof (el as HTMLElement).hasAttribute === "function" &&
              (el as HTMLElement).hasAttribute("data-ux-ignore")) ||
            (typeof (el as HTMLElement).closest === "function" &&
              !!(el as HTMLElement).closest("[data-ux-ignore]")),
        });
      } finally {
        if (nav && navSaved) {
          nav.style.position = navSaved.position;
          nav.style.top = navSaved.top;
          nav.style.bottom = navSaved.bottom;
        }
      }



      downloadCanvas(canvas, `${entry.viewName}.png`);
      setStatus(idx, "done");
    } catch (err) {
      console.error("[ExportScreens] capture failed", entry, err);
      setStatus(idx, "error");
    }
  }, []);

  const exportAll = useCallback(async () => {
    setRunning(true);
    setStatuses({});
    for (let i = 0; i < SCREENS.length; i++) {
      await captureOne(i);
      await sleep(BETWEEN_MS);
    }
    setCurrentIdx(null);
    setRunning(false);
  }, [captureOne]);

  return (
    <div
      data-ux-ignore
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#0a0a0c",
        color: "#e5e7eb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        Research · Export Screens
      </h1>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16, maxWidth: 720 }}>
        Renders each routed screen at {CAPTURE_WIDTH}px wide inside an iframe,
        waits for data to load, then downloads a full-height PNG named
        <code style={{ margin: "0 4px" }}>{`{viewName}.png`}</code>
        using the same viewName the click tracker logs.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={exportAll}
          disabled={running}
          style={{
            padding: "8px 14px",
            background: running ? "#374151" : "#2563eb",
            color: "white",
            border: 0,
            borderRadius: 6,
            cursor: running ? "default" : "pointer",
            fontWeight: 600,
          }}
        >
          {running ? "Exporting…" : "Export all screens"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: 13,
            minWidth: 520,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.75 }}>
              <th style={{ padding: "6px 10px" }}>#</th>
              <th style={{ padding: "6px 10px" }}>viewName</th>
              <th style={{ padding: "6px 10px" }}>path</th>
              <th style={{ padding: "6px 10px" }}>status</th>
              <th style={{ padding: "6px 10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {SCREENS.map((s, i) => {
              const st = statuses[i] ?? "pending";
              const color =
                st === "done"
                  ? "#22c55e"
                  : st === "running"
                    ? "#facc15"
                    : st === "error"
                      ? "#ef4444"
                      : "#6b7280";
              return (
                <tr
                  key={`${s.path}-${i}`}
                  style={{ borderTop: "1px solid #1f2937" }}
                >
                  <td style={{ padding: "6px 10px", opacity: 0.6 }}>{i + 1}</td>
                  <td style={{ padding: "6px 10px", fontWeight: 600 }}>
                    {s.viewName}
                  </td>
                  <td style={{ padding: "6px 10px", opacity: 0.8 }}>
                    <code>{s.path}</code>
                  </td>
                  <td style={{ padding: "6px 10px", color }}>{st}</td>
                  <td style={{ padding: "6px 10px" }}>
                    <button
                      onClick={() => captureOne(i)}
                      disabled={running}
                      style={{
                        padding: "4px 10px",
                        background: "#1f2937",
                        color: "#e5e7eb",
                        border: "1px solid #374151",
                        borderRadius: 4,
                        cursor: running ? "default" : "pointer",
                      }}
                    >
                      Export
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: 8,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              fontSize: 12,
              opacity: 0.7,
              borderBottom: "1px solid #1f2937",
            }}
          >
            Live render{" "}
            {currentIdx != null ? `· ${SCREENS[currentIdx].viewName}` : ""}
          </div>
          <iframe
            ref={frameRef}
            title="export-frame"
            style={{
              width: CAPTURE_WIDTH,
              height: 852,
              border: 0,
              display: "block",
              background: "#fff",
            }}
          />
        </div>
      </div>
    </div>
  );
}
