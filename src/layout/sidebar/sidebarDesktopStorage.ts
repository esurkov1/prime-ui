import type { SidebarLayoutMode } from "./sidebarLayout";

const STORAGE_VERSION = 1 as const;

export type StoredSidebarDesktopMode = Extract<SidebarLayoutMode, "expanded" | "compact">;

type StoredPayload = {
  v: typeof STORAGE_VERSION;
  desktop: StoredSidebarDesktopMode;
};

function isStoredPayload(value: unknown): value is StoredPayload {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return o.v === STORAGE_VERSION && (o.desktop === "expanded" || o.desktop === "compact");
}

export function readStoredDesktopMode(key: string): StoredSidebarDesktopMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredPayload(parsed)) return null;
    return parsed.desktop;
  } catch {
    return null;
  }
}

export function writeStoredDesktopMode(key: string, mode: StoredSidebarDesktopMode): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredPayload = { v: STORAGE_VERSION, desktop: mode };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}
