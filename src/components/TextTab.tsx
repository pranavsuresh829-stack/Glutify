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
    onResult(checkIngredientsText(text));
  }

  return (
    <div>
      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Paste Ingredients
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Wheat flour, sugar, palm oil, salt, natural flavoring, soy lecithin..."
        className="min-h-[120px] w-full resize-y rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 p-3.5 text-sm text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
      />
      <button
        onClick={handleCheck}
        disabled={!text.trim()}
        className="mt-2.5 w-full rounded-full bg-glutify-ink py-4 text-[14.5px] font-extrabold tracking-tight text-glutify-lime transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Check Ingredients
      </button>
    </div>
  );
}
