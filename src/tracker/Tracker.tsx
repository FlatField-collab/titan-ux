import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {
  getActiveSessionId,
  loadSession,
  saveSession,
  setActiveSessionId,
} from "./db";
import {
  findMeaningfulClickable,
  resolveLabel,
  resolveSelector,
  resolveTagType,
  resolveViewName,
} from "./resolver";
import type {
  InteractionEvent,
  TaskTiming,
  UsabilitySession,
} from "./types";
import { STUDY_CONFIG } from "./StudyConfig";
import { UxOverlay } from "./ux/UxOverlay";
import { ResearcherPill } from "./ux/ResearcherPill";

export type StudyPhase = "uid" | "task-card" | "in-task" | "complete";

interface TrackerCtx {
  session: UsabilitySession | null;
  started: boolean;
  phase: StudyPhase;
  currentTaskIndex: number;
  taskStartAt: number | null;
  participantId: string;
  beginStudy: (participantId: string) => void;
  startTask: () => Promise<void>;
  completeTask: () => Promise<void>;
  submitSession: () => Promise<void>;
  endAndDownload: () => Promise<void>;
}

const Ctx = createContext<TrackerCtx | null>(null);
export const useTracker = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTracker outside provider");
  return c;
};

const NAMED_KEYS = new Set([
  "Escape",
  "Tab",
  "Enter",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

function isIgnored(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest("[data-ux-ignore]");
}

function nowIso() {
  return new Date().toISOString();
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UsabilitySession | null>(null);
  const sessionRef = useRef<UsabilitySession | null>(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<StudyPhase>("uid");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskStartAt, setTaskStartAt] = useState<number | null>(null);
  const [participantId, setParticipantId] = useState("");
  const writeTimerRef = useRef<number | null>(null);
  const location = useLocation();

  // Resume from IDB on mount
  useEffect(() => {
    (async () => {
      const id = getActiveSessionId();
      if (!id) return;
      const s = await loadSession(id);
      if (s && !s.endedAt) {
        sessionRef.current = s;
        setSession(s);
        startedRef.current = true;
        setStarted(true);
        setParticipantId(s.label || "");
        const completed = s.tasks?.length ?? 0;
        if (completed >= STUDY_CONFIG.tasks.length) {
          setPhase("complete");
        } else {
          setCurrentTaskIndex(completed);
          setPhase("task-card");
        }
      } else {
        setActiveSessionId(null);
      }
    })();
  }, []);

  const scheduleWrite = useCallback(() => {
    if (writeTimerRef.current != null) return;
    writeTimerRef.current = window.setTimeout(() => {
      writeTimerRef.current = null;
      const s = sessionRef.current;
      if (s) void saveSession(s);
    }, 400);
  }, []);

  const push = useCallback(
    (ev: InteractionEvent) => {
      const s = sessionRef.current;
      if (!s || !startedRef.current) return;
      s.interactions.push(ev);
      setSession({ ...s });
      scheduleWrite();
    },
    [scheduleWrite],
  );

  const ensureSession = useCallback(
    async (label: string): Promise<UsabilitySession> => {
      if (sessionRef.current) return sessionRef.current;
      const id = nowIso();
      const s: UsabilitySession = {
        id,
        label,
        studyId: STUDY_CONFIG.studyId,
        createdAt: id,
        interactions: [],
        tasks: [],
      };
      sessionRef.current = s;
      setSession(s);
      setActiveSessionId(id);
      await saveSession(s);
      return s;
    },
    [],
  );

  const beginStudy = useCallback((pid: string) => {
    setParticipantId(pid);
    setCurrentTaskIndex(0);
    setPhase("task-card");
  }, []);

  const startTask = useCallback(async () => {
    const s = await ensureSession(participantId);
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
      // Initial nav event on first task start
      s.interactions.push({
        t: nowIso(),
        type: "nav",
        viewName: resolveViewName(),
        pathname: location.pathname,
      });
      setSession({ ...s });
      scheduleWrite();
    }
    setTaskStartAt(Date.now());
    setPhase("in-task");
  }, [ensureSession, participantId, location.pathname, scheduleWrite]);

  const completeTask = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;
    const task = STUDY_CONFIG.tasks[currentTaskIndex];
    if (!task) return;
    const startedAtMs = taskStartAt ?? Date.now();
    const completedAtMs = Date.now();
    const durationMs = completedAtMs - startedAtMs;
    const startedAtIso = new Date(startedAtMs).toISOString();
    const completedAtIso = new Date(completedAtMs).toISOString();

    s.interactions.push({
      t: completedAtIso,
      type: "task_complete",
      taskId: task.id,
      taskTitle: task.title,
      durationMs,
      viewName: resolveViewName(),
      pathname: location.pathname,
    });
    if (!s.tasks) s.tasks = [];
    s.tasks.push({
      taskId: task.id,
      taskTitle: task.title,
      startedAt: startedAtIso,
      completedAt: completedAtIso,
      durationMs,
    });
    setSession({ ...s });

    // Advance phase synchronously so the completion screen always appears,
    // even if persistence fails. Persist in the background.
    const isLast = currentTaskIndex + 1 >= STUDY_CONFIG.tasks.length;
    setTaskStartAt(null);
    if (isLast) {
      setPhase("complete");
    } else {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setPhase("task-card");
    }
    try {
      await saveSession(s);
    } catch {
      // ignore — UI has already advanced
    }
  }, [currentTaskIndex, taskStartAt, location.pathname]);

  const submitSession = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) throw new Error("no session");
    if (!s.endedAt) {
      s.endedAt = nowIso();
      await saveSession(s);
    }
    const payload = {
      id: s.id,
      label: s.label,
      study_id: STUDY_CONFIG.studyId,
      created_at: s.createdAt,
      ended_at: s.endedAt,
      tasks: s.tasks ?? [],
      interactions: s.interactions,
    };
    // Snapshot config locally so headers can never resolve to undefined/empty
    // at request time, and assert before sending.
    const supabaseUrl = STUDY_CONFIG.supabaseUrl;
    const supabaseKey = STUDY_CONFIG.supabaseKey;
    if (
      !supabaseUrl ||
      typeof supabaseUrl !== "string" ||
      !/^https?:\/\//.test(supabaseUrl)
    ) {
      throw new Error(
        `Supabase URL is missing or invalid at request time: ${JSON.stringify(supabaseUrl)}`,
      );
    }
    if (
      !supabaseKey ||
      typeof supabaseKey !== "string" ||
      supabaseKey.length < 20 ||
      /placeholder|your[-_]?key|xxxx/i.test(supabaseKey)
    ) {
      throw new Error(
        `Supabase anon/publishable key is missing or a placeholder at request time (length=${supabaseKey?.length ?? 0})`,
      );
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    };
    // Confirm both auth headers are populated with the real key right before fetch
    if (!headers.apikey || !headers.Authorization?.startsWith("Bearer ")) {
      throw new Error("Supabase auth headers failed to populate");
    }
    // eslint-disable-next-line no-console
    console.info("[tracker] POST ux_sessions", {
      url: `${supabaseUrl}/rest/v1/ux_sessions`,
      apikeyPresent: Boolean(headers.apikey),
      apikeyPrefix: supabaseKey.slice(0, 10),
      authPresent: Boolean(headers.Authorization),
    });
    const response = await fetch(`${supabaseUrl}/rest/v1/ux_sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Supabase POST failed: ${response.status} ${response.statusText} ${body}`,
      );
    }
    setActiveSessionId(null);
  }, []);

  const endAndDownload = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;
    s.endedAt = nowIso();
    await saveSession(s);
    setActiveSessionId(null);
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ux-session_${s.label || "anon"}_${s.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    startedRef.current = false;
    sessionRef.current = null;
    setSession(null);
    setStarted(false);
    setPhase("uid");
    setCurrentTaskIndex(0);
    setTaskStartAt(null);
  }, []);

  // Click capture
  const lastClickTargetRef = useRef<Element | null>(null);
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      if (!startedRef.current) return;
      if (isIgnored(ev.target)) return;
      const raw = ev.target instanceof Element ? ev.target : null;
      const el = findMeaningfulClickable(raw);
      if (!el) return;
      lastClickTargetRef.current = el;
      push({
        t: nowIso(),
        type: "click",
        x: ev.clientX,
        y: ev.clientY,
        viewName: resolveViewName(el),
        pathname: location.pathname,
        tagType: resolveTagType(el),
        label: resolveLabel(el),
        role: el.getAttribute("role"),
        tag: el.tagName.toLowerCase(),
        selector: resolveSelector(el),
      });
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as any);
  }, [push, location.pathname]);

  // Bridge for the navigation guard (`useGuardedNavigate`): when a tap
  // targets an unbuilt route, tag the most recent click as `wired: false`
  // and apply a brief tap-flash so the element still feels responsive.
  useEffect(() => {
    const flash = (el: Element | null) => {
      if (!el) return;
      el.classList.add("ux-tap-flash");
      window.setTimeout(() => el.classList.remove("ux-tap-flash"), 220);
    };
    const markLastClick = (wired: boolean) => {
      const s = sessionRef.current;
      if (!s) return;
      for (let i = s.interactions.length - 1; i >= 0; i--) {
        const ev = s.interactions[i];
        if (ev.type === "click") {
          (ev as { wired?: boolean }).wired = wired;
          scheduleWrite();
          return;
        }
      }
    };
    (window as unknown as { __uxBlockedTap?: () => void }).__uxBlockedTap = () => {
      markLastClick(false);
      flash(lastClickTargetRef.current);
    };
    return () => {
      delete (window as { __uxBlockedTap?: () => void }).__uxBlockedTap;
    };
  }, [scheduleWrite]);


  // Scroll capture
  useEffect(() => {
    let last = 0;
    const onScroll = (ev: Event) => {
      if (!startedRef.current) return;
      if (isIgnored(ev.target)) return;
      const now = Date.now();
      if (now - last < 500) return;
      last = now;
      const t = ev.target;
      const scrollY =
        t instanceof Element
          ? t.scrollTop
          : window.scrollY || document.documentElement.scrollTop || 0;
      push({
        t: nowIso(),
        type: "scroll",
        scrollY,
        viewName: resolveViewName(t instanceof Element ? t : null),
        pathname: location.pathname,
      });
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as any);
  }, [push, location.pathname]);

  // Keys
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!startedRef.current) return;
      if (isIgnored(ev.target)) return;
      const isMod = ev.metaKey || ev.ctrlKey || ev.altKey;
      const isNamed = NAMED_KEYS.has(ev.key);
      if (!isMod && !isNamed) return;
      push({
        t: nowIso(),
        type: "key",
        key: ev.key,
        meta: ev.metaKey,
        ctrl: ev.ctrlKey,
        alt: ev.altKey,
        shift: ev.shiftKey,
        viewName: resolveViewName(ev.target instanceof Element ? ev.target : null),
        pathname: location.pathname,
      });
    };
    document.addEventListener("keydown", onKey, { capture: true, passive: true });
    return () => document.removeEventListener("keydown", onKey, { capture: true } as any);
  }, [push, location.pathname]);

  // Input blur
  useEffect(() => {
    const onBlur = (ev: FocusEvent) => {
      if (!startedRef.current) return;
      if (isIgnored(ev.target)) return;
      const el = ev.target;
      if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) return;
      if (el instanceof HTMLInputElement && el.type === "password") return;
      const inputType = el instanceof HTMLInputElement ? el.type : "textarea";
      push({
        t: nowIso(),
        type: "input",
        valueLength: el.value?.length ?? 0,
        inputType,
        viewName: resolveViewName(el),
        pathname: location.pathname,
        tagType: resolveTagType(el),
        label: resolveLabel(el),
        role: el.getAttribute("role"),
        tag: el.tagName.toLowerCase(),
        selector: resolveSelector(el),
      });
    };
    document.addEventListener("blur", onBlur, { capture: true });
    return () => document.removeEventListener("blur", onBlur, { capture: true } as any);
  }, [push, location.pathname]);

  // Submit
  useEffect(() => {
    const onSubmit = (ev: Event) => {
      if (!startedRef.current) return;
      if (isIgnored(ev.target)) return;
      const el = ev.target instanceof Element ? ev.target : null;
      if (!el) return;
      push({
        t: nowIso(),
        type: "submit",
        viewName: resolveViewName(el),
        pathname: location.pathname,
        tagType: resolveTagType(el),
        label: resolveLabel(el),
        role: el.getAttribute("role"),
        tag: el.tagName.toLowerCase(),
        selector: resolveSelector(el),
      });
    };
    document.addEventListener("submit", onSubmit, { capture: true, passive: true });
    return () => document.removeEventListener("submit", onSubmit, { capture: true } as any);
  }, [push, location.pathname]);

  // Nav
  useEffect(() => {
    const fire = () => {
      if (!startedRef.current) return;
      push({
        t: nowIso(),
        type: "nav",
        viewName: resolveViewName(),
        pathname: window.location.pathname,
      });
    };
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args as any);
      queueMicrotask(fire);
      return r;
    };
    window.history.replaceState = function (...args) {
      const r = origReplace.apply(this, args as any);
      queueMicrotask(fire);
      return r;
    };
    window.addEventListener("popstate", fire);
    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", fire);
    };
  }, [push]);

  const value = useMemo<TrackerCtx>(
    () => ({
      session,
      started,
      phase,
      currentTaskIndex,
      taskStartAt,
      participantId,
      beginStudy,
      startTask,
      completeTask,
      submitSession,
      endAndDownload,
    }),
    [
      session,
      started,
      phase,
      currentTaskIndex,
      taskStartAt,
      participantId,
      beginStudy,
      startTask,
      completeTask,
      submitSession,
      endAndDownload,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function TrackerUi() {
  // ResearcherPill intentionally omitted — must never appear to participants.
  return <UxOverlay />;
}
