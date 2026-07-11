export type Verdict = "safe" | "warn" | "bad";

export interface Flag {
  label: string;
  tag: "definite" | "check" | "trace";
}

export interface AnalyzeResult {
  definite: string[];
  check: string[];
  trace: string[];
}

export interface CheckResult {
  verdict: Verdict;
  title: string;
  subtitle: string;
  flags: Flag[];
  productName?: string;
  rawText?: string;
}

export interface ScanHistoryEntry {
  id: string;
  name: string;
  verdict: Verdict;
  when: number;
  saved: boolean;
}

export interface SafeSpot {
  id: string;
  name: string;
  city: string;
  note: string;
  addedAt: number;
}
