"use client";

import { useState } from "react";
import { checkIngredientsText } from "../lib/glutenCheck";
import { CheckResult } from "../lib/types";

export default function TextTab({
  onResult,
}: {
  onResult: (result: CheckResult) => void;
}) {
  const [text, setText] = useState("");

  function handleCheck() {
    if (!text.trim()) return;
    onResult(checkIngredientsText(text, "text"));
  }

  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
        Paste Ingredients
      </h2>
      <div className="mt-2 border-t border-black/10" />
      <p className="mt-3 text-sm text-glutify-ink/50">
        Paste an ingredient list and Glootie will flag anything that could
        contain gluten.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="e.g. Water, sugar, wheat flour, salt, natural flavoring..."
        className="mt-4 w-full resize-none rounded-2xl bg-glutify-cream p-4 text-sm text-glutify-ink placeholder:text-glutify-ink/30 focus:outline-none focus:ring-2 focus:ring-glutify-lime-deep"
      />
      <button
        onClick={handleCheck}
        disabled={!text.trim()}
        className="mt-3 w-full rounded-full bg-glutify-ink py-3.5 font-semibold text-glutify-lime transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Check Ingredients
      </button>
    </div>
  );
}
