import { createStore, get, set, del, keys } from "idb-keyval";
import type { UsabilitySession } from "./types";

export const uxStore = createStore("ux-sessions", "kv");

const ACTIVE_KEY_LS = "ux-tracker:active-session-id";

export function getActiveSessionId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY_LS);
  } catch {
    return null;
  }
}
export function setActiveSessionId(id: string | null) {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY_LS, id);
    else localStorage.removeItem(ACTIVE_KEY_LS);
  } catch {
    /* ignore */
  }
}

export async function loadSession(id: string): Promise<UsabilitySession | undefined> {
  return (await get(id, uxStore)) as UsabilitySession | undefined;
}

export async function saveSession(session: UsabilitySession): Promise<void> {
  await set(session.id, session, uxStore);
}

export async function deleteSession(id: string): Promise<void> {
  await del(id, uxStore);
}

export async function listSessionIds(): Promise<string[]> {
  return (await keys(uxStore)) as string[];
}
