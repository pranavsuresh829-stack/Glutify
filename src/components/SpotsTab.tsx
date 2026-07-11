"use client";

import { useEffect, useState } from "react";
import { addSafeSpot, getSafeSpots } from "../lib/storage";
import { SafeSpot } from "../lib/types";
import { MiniMascot } from "./Mascot";

export default function SpotsTab() {
  const [spots, setSpots] = useState<SafeSpot[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSpots(getSafeSpots());
    setLoaded(true);
  }, []);

  function handleAdd() {
    if (!name.trim() || !city.trim()) {
      setStatus("Add at least a name and city.");
      return;
    }
    setSpots(addSafeSpot(name.trim(), city.trim(), note.trim()));
    setName("");
    setCity("");
    setNote("");
    setStatus("Added to your list.");
  }

  return (
    <div>
      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Add a Safe Spot
      </h2>
      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Restaurant or cafe name"
          className="w-full rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City or neighborhood"
          className="w-full rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why it's safe: dedicated fryer, GF menu, celiac-aware staff, etc."
          className="min-h-[60px] w-full resize-y rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
      </div>
      <button
        onClick={handleAdd}
        className="mt-2.5 w-full rounded-full bg-glutify-ink py-4 text-[14.5px] font-extrabold tracking-tight text-glutify-lime transition active:scale-[0.98]"
      >
        Add Spot
      </button>
      <div className="mt-2.5 min-h-[16px] text-[12.5px] font-semibold text-glutify-ink-dim">
        {status}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {loaded && spots.length === 0 && (
          <div className="py-5 text-center text-[13px] text-glutify-ink-dim">
            <div className="flex justify-center">
              <MiniMascot size={60} mood="idle" />
            </div>
            <div className="mt-2.5">
              No spots added yet.
              <br />
              Be the first to add one.
            </div>
          </div>
        )}
        {spots.map((s) => (
          <div key={s.id} className="rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-[15px] font-bold tracking-tight">{s.name}</div>
              <div className="flex-shrink-0 whitespace-nowrap rounded-full border border-glutify-line bg-glutify-panel px-2.5 py-1 text-[10.5px] font-bold text-glutify-ink-dim">
                {s.city}
              </div>
            </div>
            {s.note && <div className="mt-1.5 text-[12.5px] leading-snug text-glutify-ink-dim">{s.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
