import { Verdict } from "../lib/types";

const POSITIONS: Record<Verdict, string> = {
  safe: "16.6%",
  warn: "50%",
  bad: "83.3%",
};

const MARKER_COLOR: Record<Verdict, string> = {
  safe: "bg-glutify-safe",
  warn: "bg-glutify-warn",
  bad: "bg-glutify-danger",
};

const ZONE_ACTIVE: Record<Verdict, "safe" | "warn" | "bad"> = {
  safe: "safe",
  warn: "warn",
  bad: "bad",
};

export default function VerdictScale({ verdict }: { verdict: Verdict }) {
  const active = ZONE_ACTIVE[verdict];

  return (
    <div className="bg-glutify-panel px-5 pb-1 pt-4">
      <div className="relative mb-2 flex h-2.5 gap-1">
        <div
          className={`flex-1 rounded-full bg-glutify-safe transition-opacity duration-[400ms] ${active === "safe" ? "opacity-100" : "opacity-30"}`}
        />
        <div
          className={`flex-1 rounded-full bg-glutify-warn transition-opacity duration-[400ms] ${active === "warn" ? "opacity-100" : "opacity-30"}`}
        />
        <div
          className={`flex-1 rounded-full bg-glutify-danger transition-opacity duration-[400ms] ${active === "bad" ? "opacity-100" : "opacity-30"}`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-500 ease-[cubic-bezier(.34,1.4,.5,1)]"
          style={{ left: POSITIONS[verdict] }}
        >
          <div className={`h-[22px] w-[22px] rounded-full border-[3px] border-glutify-ink shadow-md ${MARKER_COLOR[verdict]}`} />
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-glutify-ink-dim">
        <span className="flex-1 text-left">Gluten-free</span>
        <span className="flex-1 text-center">Check closer</span>
        <span className="flex-1 text-right">Contains</span>
      </div>
    </div>
  );
}
