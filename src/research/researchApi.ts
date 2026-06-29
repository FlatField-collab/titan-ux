import { STUDY_CONFIG } from "@/tracker/StudyConfig";
import type { UsabilitySession, InteractionEvent } from "@/tracker/types";

const URL = STUDY_CONFIG.supabaseUrl;
const KEY = STUDY_CONFIG.supabaseKey;

const baseHeaders = (): Record<string, string> => ({
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
});

export interface SessionRow {
  interactions: InteractionEvent[];
  tasks: UsabilitySession["tasks"];
}

export async function fetchSessions(): Promise<SessionRow[]> {
  const res = await fetch(`${URL}/rest/v1/ux_sessions?select=interactions,tasks`, {
    headers: baseHeaders(),
  });
  if (!res.ok) throw new Error(`fetchSessions ${res.status}`);
  return res.json();
}

export interface TargetRow {
  task_key: string;
  view_name: string;
  x_pct: number;
  y_pct: number;
  radius_px: number;
}

export async function fetchTargets(viewName: string): Promise<TargetRow[]> {
  const res = await fetch(
    `${URL}/rest/v1/ux_targets?view_name=eq.${encodeURIComponent(viewName)}&select=*`,
    { headers: baseHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function upsertTarget(row: TargetRow): Promise<void> {
  await fetch(`${URL}/rest/v1/ux_targets`, {
    method: "POST",
    headers: {
      ...baseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });
}
