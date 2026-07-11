import { CheckResult, SafeSpot, ScanHistoryEntry } from "./types";

const HISTORY_KEY = "glutify:history";
const SPOTS_KEY = "glutify:spots";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getHistory(): ScanHistoryEntry[] {
  return read<ScanHistoryEntry[]>(HISTORY_KEY, []);
}

export function addHistoryEntry(result: CheckResult): ScanHistoryEntry {
  const entry: ScanHistoryEntry = {
    ...result,
    id: makeId(),
    timestamp: Date.now(),
    saved: false,
  };
  const history = [entry, ...getHistory()].slice(0, 200);
  write(HISTORY_KEY, history);
  return entry;
}

export function toggleHistorySaved(id: string): ScanHistoryEntry[] {
  const history = getHistory().map((e) =>
    e.id === id ? { ...e, saved: !e.saved } : e
  );
  write(HISTORY_KEY, history);
  return history;
}

export function clearHistory(): void {
  write(HISTORY_KEY, []);
}

export function getSafeSpots(): SafeSpot[] {
  return read<SafeSpot[]>(SPOTS_KEY, []);
}

export function addSafeSpot(name: string, notes: string): SafeSpot[] {
  const spot: SafeSpot = { id: makeId(), name, notes, timestamp: Date.now() };
  const spots = [spot, ...getSafeSpots()];
  write(SPOTS_KEY, spots);
  return spots;
}

export function removeSafeSpot(id: string): SafeSpot[] {
  const spots = getSafeSpots().filter((s) => s.id !== id);
  write(SPOTS_KEY, spots);
  return spots;
}
