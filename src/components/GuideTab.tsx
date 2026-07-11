import { CHECK, DEFINITE, TRACE_PHRASES } from "../lib/glutenCheck";

const GROUPS = [
  {
    title: "Always contains gluten",
    dot: "bg-glutify-danger",
    desc: "If you see any of these on a label, it has gluten. No exceptions.",
    items: DEFINITE,
  },
  {
    title: "Check closer, could go either way",
    dot: "bg-glutify-warn",
    desc: "These are ambiguous. Sometimes gluten-free, sometimes not, or a common hiding spot. Worth a second look or a call to the brand.",
    items: CHECK,
  },
  {
    title: "Cross-contamination warnings",
    dot: "bg-glutify-ink-dim",
    desc: "Not an ingredient, but a warning phrase. Matters more if you're highly sensitive or celiac.",
    items: TRACE_PHRASES,
  },
];

export default function GuideTab() {
  return (
    <div>
      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Hidden Gluten Cheat Sheet
      </h2>
      {GROUPS.map((g, i) => (
        <div key={g.title} className={i < GROUPS.length - 1 ? "mb-5" : ""}>
          <div className="font-display mb-1.5 flex items-center gap-2.5 text-[14.5px] font-bold tracking-tight">
            <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${g.dot}`} />
            {g.title}
          </div>
          <div className="mb-2.5 text-[12.5px] leading-relaxed text-glutify-ink-dim">{g.desc}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((item) => (
              <span
                key={item}
                className="font-mono rounded-full border border-glutify-line bg-glutify-panel-2 px-2.5 py-1.5 text-[11px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
