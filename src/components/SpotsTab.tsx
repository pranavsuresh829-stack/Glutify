"use client";

import { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { addSafeSpot, getSafeSpots, removeSafeSpot } from "../lib/storage";
import { SafeSpot } from "../lib/types";

export default function SpotsTab() {
  const [spots, setSpots] = useState<SafeSpot[]>([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setSpots(getSafeSpots());
  }, []);

  function handleAdd() {
    if (!name.trim()) return;
    setSpots(addSafeSpot(name.trim(), notes.trim()));
    setName("");
    setNotes("");
  }

  function handleRemove(id: string) {
    setSpots(removeSafeSpot(id));
  }

  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
        Add a Safe Spot
      </h2>
      <div className="mt-2 border-t border-black/10" />
      <p className="mt-3 text-sm text-glutify-ink/50">
        Keep a personal list of restaurants or stores you trust are
        gluten-free safe.
      </p>

      <div className="mt-4 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Place name"
          className="w-full rounded-full bg-glutify-cream px-4 py-3 text-sm text-glutify-ink placeholder:text-glutify-ink/30 focus:outline-none focus:ring-2 focus:ring-glutify-lime-deep"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Notes (dedicated fryer, GF menu, etc.)"
          className="w-full resize-none rounded-2xl bg-glutify-cream p-4 text-sm text-glutify-ink placeholder:text-glutify-ink/30 focus:outline-none focus:ring-2 focus:ring-glutify-lime-deep"
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="w-full rounded-full bg-glutify-ink py-3 font-semibold text-glutify-lime transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add Spot
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {spots.length === 0 && (
          <p className="text-sm text-glutify-ink/40">No safe spots saved yet.</p>
        )}
        {spots.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between gap-3 rounded-2xl bg-glutify-cream p-3"
          >
            <div className="flex min-w-0 gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-glutify-lime-deep" />
              <div className="min-w-0">
                <p className="truncate font-medium text-glutify-ink">{s.name}</p>
                {s.notes && <p className="text-sm text-glutify-ink/50">{s.notes}</p>}
              </div>
            </div>
            <button
              onClick={() => handleRemove(s.id)}
              className="flex-shrink-0 text-glutify-ink/30 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
