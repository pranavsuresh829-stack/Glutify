"use client";

import { useEffect, useState } from "react";
import { clearHistory, getHistory, setHistorySaved, timeAgo, VERDICT_LABEL } from "../lib/storage";
import { ScanHistoryEntry } from "../lib/types";
import { MiniMascot } from "./Mascot";

const DOT_COLOR: Record<ScanHistoryEntry["verdict"], string> = {
  safe: "bg-glutify-safe",
  warn: "bg-glutify-warn",
  bad: "bg-glutify-danger",
};

export default function HistoryTab() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "saved">("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setLoaded(true);
  }, []);

  function toggleSaved(id: string, currentlySaved: boolean) {
    setHistory(setHistorySaved(id, !currentlySaved));
  }

  function handleClear() {
    if (confirm("Clear your entire scan history? Saved items will be removed too.")) {
      clearHistory();
      setHistory([]);
    }
  }

  const visible = filter === "saved" ? history.filter((h) => h.saved) : history;

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">Your Scans</h2>
        <button
          onClick={handleClear}
          className="rounded-full border-[1.5px] border-glutify-line px-3 py-1.5 text-[11.5px] font-bold text-glutify-ink-dim hover:border-glutify-danger hover:text-glutify-danger"
        >
          Clear all
        </button>
      </div>

      <div className="mb-3.5 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 rounded-full border-[1.5px] py-2 text-[12.5px] font-bold transition ${
            filter === "all" ? "border-glutify-ink bg-glutify-ink text-glutify-lime" : "border-glutify-line text-glutify-ink-dim"
          }`}
        >
          All scans
        </button>
        <button
          onClick={() => setFilter("saved")}
          className={`flex-1 rounded-full border-[1.5px] py-2 text-[12.5px] font-bold transition ${
            filter === "saved" ? "border-glutify-ink bg-glutify-ink text-glutify-lime" : "border-glutify-line text-glutify-ink-dim"
          }`}
        >
          ★ Saved
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {loaded && visible.length === 0 && (
          <div className="py-6 text-center text-[13px] leading-relaxed text-glutify-ink-dim">
            <div className="flex justify-center">
              <MiniMascot size={64} mood="idle" />
            </div>
            <div className="mt-2.5">
              {filter === "saved" ? (
                <>
                  No saved items yet.
                  <br />
                  Tap ☆ on any result to keep it here.
                </>
              ) : (
                <>
                  No scans yet.
                  <br />
                  Your history builds up here as you go.
                </>
              )}
            </div>
          </div>
        )}
        {visible.map((h) => (
          <div
            key={h.id}
            className="flex items-center gap-3 rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3"
          >
            <span className={`h-[11px] w-[11px] flex-shrink-0 rounded-full ${DOT_COLOR[h.verdict]}`} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-bold">{h.name}</div>
              <div className="mt-0.5 text-[11px] text-glutify-ink-dim">
                {VERDICT_LABEL[h.verdict]} · {timeAgo(h.when)}
              </div>
            </div>
            <button
              onClick={() => toggleSaved(h.id, h.saved)}
              className={`flex-shrink-0 p-0.5 text-xl leading-none ${h.saved ? "text-glutify-lime-deep" : "text-glutify-ink-dim"}`}
            >
              {h.saved ? "★" : "☆"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
