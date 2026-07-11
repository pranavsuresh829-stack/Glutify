"use client";

import { ChangeEvent, useState } from "react";
import { Upload } from "lucide-react";
import { checkIngredientsText } from "../lib/glutenCheck";
import { CheckResult } from "../lib/types";

export default function PhotoLabelTab({
  onResult,
}: {
  onResult: (result: CheckResult) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStatus("");
  }

  async function readAndCheck() {
    if (!file || !previewUrl) return;
    setLoading(true);
    setStatus("Reading label text… this can take 10–20s.");
    try {
      const Tesseract = await import("tesseract.js");
      const {
        data: { text },
      } = await Tesseract.recognize(previewUrl, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setStatus(`Reading label text… ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      const clean = (text || "").trim();
      if (!clean) {
        setStatus("No text found. Get the ingredients list close, flat, and well-lit, then try again.");
        return;
      }
      setStatus("Done.");
      onResult({ ...checkIngredientsText(clean), rawText: clean });
    } catch {
      setStatus("Could not read the image. Try a clearer, closer photo of the ingredients list, or paste the text into the Text tab.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Photo of Ingredients Label
      </h2>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        id="label-photo-input"
      />
      <label
        htmlFor="label-photo-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-glutify-line bg-glutify-panel-2 py-9 text-center text-[13.5px] font-semibold text-glutify-ink-dim transition hover:border-glutify-lime-deep hover:bg-glutify-lime-soft hover:text-glutify-ink"
      >
        <Upload className="h-4 w-4" />
        Tap to take a photo or upload a label image
      </label>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Ingredients label preview" className="mt-3 max-w-full rounded-2xl" />
      )}

      {file && (
        <button
          onClick={readAndCheck}
          disabled={loading}
          className="mt-3 w-full rounded-full bg-glutify-ink py-4 text-[14.5px] font-extrabold tracking-tight text-glutify-lime transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Read & Check Label
        </button>
      )}

      <div className="mt-2.5 min-h-[16px] text-[12.5px] font-semibold text-glutify-ink-dim">
        {status}
      </div>
    </div>
  );
}
