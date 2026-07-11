import { CONTAINS_GLUTEN, HIDDEN_GLUTEN } from "../lib/glutenCheck";

export default function GuideTab() {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
        Hidden Gluten Cheat Sheet
      </h2>
      <div className="mt-2 border-t border-black/10" />
      <p className="mt-3 text-sm text-glutify-ink/50">
        Ingredient names that don&rsquo;t obviously say &ldquo;wheat&rdquo; but
        can still mean gluten.
      </p>

      <div className="mt-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-rose-600/80">
          Always contains gluten
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTAINS_GLUTEN.map((t) => (
            <span
              key={t.term}
              title={t.reason}
              className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
            >
              {t.term}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wide text-amber-700/80">
          Sneaky / ambiguous — check closer
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {HIDDEN_GLUTEN.map((t) => (
            <span
              key={t.term}
              title={t.reason}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
            >
              {t.term}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-glutify-ink/40">
        Tap any term to see why it&rsquo;s flagged. This list isn&rsquo;t
        exhaustive — when in doubt, contact the manufacturer.
      </p>
    </div>
  );
}
