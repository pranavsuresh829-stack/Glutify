"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { clearHistory, getHistory, toggleHistorySaved } from "../lib/storage";
import { ScanHistoryEntry } from "../lib/types";

const VERDICT_DOT: Record<ScanHistoryEntry["verdict"], string> = {
  "gluten-free": "bg-emerald-500",
  caution: "bg-amber-500",
  contains: "bg-rose-500",
};

export default function HistoryTab() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "saved">("all");

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  function handleToggleSaved(id: string) {
    setHistory(toggleHistorySaved(id));
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  const visible = filter === "saved" ? history.filter((h) => h.saved) : history;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
          Your Scans
        </h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm font-medium text-glutify-ink/40 hover:text-rose-600"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="mt-2 border-t border-black/10" />

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            filter === "all" ? "bg-glutify-ink text-glutify-lime" : "text-glutify-ink/40"
          }`}
        >
          All scans
        </button>
        <button
          onClick={() => setFilter("saved")}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            filter === "saved" ? "bg-glutify-ink text-glutify-lime" : "text-glutify-ink/40"
          }`}
        >
          ★ Saved
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {visible.length === 0 && (
          <p className="text-sm text-glutify-ink/40">Nothing here yet.</p>
        )}
        {visible.map((h) => (
          <div
            key={h.id}
            className="flex items-start justify-between gap-3 rounded-2xl bg-glutify-cream p-3"
          >
            <div className="flex min-w-0 gap-2">
              <span
                className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${VERDICT_DOT[h.verdict]}`}
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-glutify-ink">
                  {h.productName || (h.rawText ? h.rawText.slice(0, 40) : h.barcode) || "Scan"}
                </p>
                <p className="text-xs text-glutify-ink/40">
                  {new Date(h.timestamp).toLocaleString()} · {h.source}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggleSaved(h.id)}
              className="flex-shrink-0 text-glutify-ink/30 hover:text-amber-500"
            >
              <Star className={`h-4 w-4 ${h.saved ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
