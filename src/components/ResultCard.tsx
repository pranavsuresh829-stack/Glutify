"use client";

import { CheckCircle2, AlertTriangle, XCircle, Star } from "lucide-react";
import { CheckResult } from "../lib/types";

const VERDICT_STYLES: Record<
  CheckResult["verdict"],
  { label: string; icon: typeof CheckCircle2; bg: string; ring: string; text: string }
> = {
  "gluten-free": {
    label: "Gluten-free",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
  },
  caution: {
    label: "Check closer",
    icon: AlertTriangle,
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    text: "text-amber-700",
  },
  contains: {
    label: "Contains gluten",
    icon: XCircle,
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    text: "text-rose-700",
  },
};

export default function ResultCard({
  result,
  onSave,
  saved,
}: {
  result: CheckResult | null;
  onSave?: () => void;
  saved?: boolean;
}) {
  if (!result) {
    return (
      <div className="rounded-3xl bg-glutify-card p-6 text-center shadow-sm ring-1 ring-black/5">
        <p className="font-semibold text-glutify-ink/70">Ready to scan</p>
        <p className="mt-1 text-sm text-glutify-ink/40">Your result shows up here.</p>
      </div>
    );
  }

  const style = VERDICT_STYLES[result.verdict];
  const Icon = style.icon;

  return (
    <div className={`rounded-3xl ${style.bg} p-6 ring-1 ${style.ring}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-7 w-7 flex-shrink-0 ${style.text}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-lg font-bold ${style.text}`}>{style.label}</h3>
            {result.productName && (
              <span className="text-sm text-glutify-ink/50">· {result.productName}</span>
            )}
          </div>
          {result.brand && <p className="text-sm text-glutify-ink/40">{result.brand}</p>}
          <p className="mt-2 text-sm leading-relaxed text-glutify-ink/80">{result.summary}</p>

          {result.flags.length > 0 && (
            <ul className="mt-4 space-y-2">
              {result.flags.map((f, i) => (
                <li
                  key={`${f.matched}-${i}`}
                  className="rounded-xl bg-white/60 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-glutify-ink/90">{f.matched}</span>
                  <span className="text-glutify-ink/50"> — {f.reason}</span>
                </li>
              ))}
            </ul>
          )}

          {onSave && (
            <button
              onClick={onSave}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium text-glutify-ink/70 transition hover:bg-white"
            >
              <Star className={`h-3.5 w-3.5 ${saved ? "fill-amber-500 text-amber-500" : ""}`} />
              {saved ? "Saved to my list" : "Save to my list"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
