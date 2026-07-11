"use client";

import { CheckResult } from "../lib/types";
import { ResultMascot } from "./Mascot";
import VerdictScale from "./VerdictScale";

const VERDICT_STYLES: Record<CheckResult["verdict"], { bg: string; text: string }> = {
  safe: { bg: "bg-glutify-safe-bg", text: "text-glutify-safe" },
  warn: { bg: "bg-glutify-warn-bg", text: "text-glutify-warn" },
  bad: { bg: "bg-glutify-danger-bg", text: "text-glutify-danger" },
};

export default function ResultCard({
  result,
  saved,
  onToggleSaved,
}: {
  result: CheckResult;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const style = VERDICT_STYLES[result.verdict];

  return (
    <div className="mx-4 mb-4 animate-fade-up overflow-hidden rounded-3xl border-[1.5px] border-glutify-line">
      <div className={`flex items-center gap-3.5 px-[21px] py-[19px] ${style.bg}`}>
        <div className="w-[60px] flex-shrink-0">
          <ResultMascot state={result.verdict} />
        </div>
        <div>
          <div className={`font-display text-[22px] font-extrabold tracking-tight ${style.text}`}>
            {result.title}
          </div>
          <div className={`mt-0.5 text-[12.5px] font-medium opacity-80 ${style.text}`}>
            {result.subtitle}
          </div>
        </div>
      </div>

      <VerdictScale verdict={result.verdict} />

      <div className="bg-glutify-panel px-[21px] pb-5 pt-4">
        {result.productName && (
          <div className="font-display mb-2.5 text-base font-bold">{result.productName}</div>
        )}

        {result.flags.length === 0 ? (
          <div className="flex items-center gap-2 py-1.5 text-sm font-semibold text-glutify-safe">
            ✓ No flagged ingredients in the text we checked.
          </div>
        ) : (
          <ul className="list-none">
            {result.flags.map((f, i) => {
              const dotColor = f.tag === "definite" ? "bg-glutify-danger" : "bg-glutify-warn";
              const tagStyle =
                f.tag === "definite"
                  ? "bg-glutify-danger-bg text-glutify-danger"
                  : "bg-glutify-warn-bg text-glutify-warn";
              const tagLabel = f.tag === "definite" ? "Contains" : f.tag === "check" ? "Check" : "Warning";
              return (
                <li
                  key={`${f.label}-${i}`}
                  className="flex items-center gap-2.5 border-b border-glutify-line py-2.5 text-sm last:border-b-0"
                >
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`} />
                  <span className="font-mono flex-1 text-[12.5px]">{f.label}</span>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${tagStyle}`}>
                    {tagLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {result.rawText && (
          <div className="font-mono mt-3.5 max-h-[120px] overflow-y-auto rounded-2xl border border-glutify-line bg-glutify-panel-2 p-3 text-[11.5px] leading-relaxed text-glutify-ink-dim">
            {result.rawText}
          </div>
        )}

        <button
          onClick={onToggleSaved}
          className={`mt-3.5 w-full rounded-full border-[1.5px] py-2.5 text-[13px] font-bold transition-colors ${
            saved
              ? "border-glutify-lime bg-glutify-lime text-glutify-ink"
              : "border-glutify-line bg-transparent text-glutify-ink hover:border-glutify-lime-deep"
          }`}
        >
          {saved ? "★ Saved to my list" : "☆ Save to my list"}
        </button>
      </div>
    </div>
  );
}
