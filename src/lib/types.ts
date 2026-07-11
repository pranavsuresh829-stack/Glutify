export type GlutenVerdict = "gluten-free" | "caution" | "contains";

export interface Flag {
  term: string;
  matched: string;
  reason: string;
}

export interface CheckResult {
  verdict: GlutenVerdict;
  summary: string;
  flags: Flag[];
  source: "text" | "barcode" | "photo-barcode" | "photo-label";
  productName?: string;
  brand?: string;
  imageUrl?: string;
  rawText?: string;
  barcode?: string;
}

export interface ScanHistoryEntry extends CheckResult {
  id: string;
  timestamp: number;
  saved: boolean;
}

export interface SafeSpot {
  id: string;
  name: string;
  notes: string;
  timestamp: number;
}
