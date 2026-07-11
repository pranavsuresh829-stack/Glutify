import { CheckResult, SafeSpot, ScanHistoryEntry } from "./types";

const HISTORY_KEY = "glutify_history";
const SPOTS_KEY = "glutify:spots";
const CONSENT_KEY = "glutify_consent";

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
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function getHistory(): ScanHistoryEntry[] {
  return read<ScanHistoryEntry[]>(HISTORY_KEY, []);
}

export function saveScan(result: CheckResult): string {
  const id = makeId();
  const name = result.productName || "Scanned item";
  const entry: ScanHistoryEntry = {
    id,
    name,
    verdict: result.verdict,
    when: Date.now(),
    saved: false,
  };
  const history = [entry, ...getHistory()].slice(0, 200);
  write(HISTORY_KEY, history);
  return id;
}

export function setHistorySaved(id: string, saved: boolean): ScanHistoryEntry[] {
  const history = getHistory().map((e) => (e.id === id ? { ...e, saved } : e));
  write(HISTORY_KEY, history);
  return history;
}

export function clearHistory(): void {
  write(HISTORY_KEY, []);
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export const VERDICT_LABEL: Record<ScanHistoryEntry["verdict"], string> = {
  safe: "Gluten-free",
  warn: "Check closer",
  bad: "Contains gluten",
};

export function getSafeSpots(): SafeSpot[] {
  return read<SafeSpot[]>(SPOTS_KEY, []);
}

export function addSafeSpot(name: string, city: string, note: string): SafeSpot[] {
  const spot: SafeSpot = { id: makeId(), name, city, note, addedAt: Date.now() };
  const spots = [spot, ...getSafeSpots()].sort((a, b) => b.addedAt - a.addedAt);
  write(SPOTS_KEY, spots);
  return spots;
}

export function hasAckedConsent(): boolean {
  return read<boolean>(CONSENT_KEY, false);
}

export function ackConsent(): void {
  write(CONSENT_KEY, true);
}
