"use client";

import { useRef, useState } from "react";
import Mascot from "../components/Mascot";
import FeedbackModal from "../components/FeedbackModal";
import ResultCard from "../components/ResultCard";
import BarcodeTab from "../components/BarcodeTab";
import PhotoLabelTab from "../components/PhotoLabelTab";
import TextTab from "../components/TextTab";
import GuideTab from "../components/GuideTab";
import SpotsTab from "../components/SpotsTab";
import HistoryTab from "../components/HistoryTab";
import { CheckResult } from "../lib/types";
import { addHistoryEntry, toggleHistorySaved } from "../lib/storage";

type TabId = "barcode" | "photo" | "text" | "guide" | "spots" | "history";

const TABS: { id: TabId; label: string }[] = [
  { id: "barcode", label: "Barcode" },
  { id: "photo", label: "Photo" },
  { id: "text", label: "Text" },
  { id: "guide", label: "Guide" },
  { id: "spots", label: "Spots" },
  { id: "history", label: "History" },
];

const SCAN_TABS: TabId[] = ["barcode", "photo", "text"];

export default function GlutifyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("barcode");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  function handleResult(r: CheckResult) {
    const entry = addHistoryEntry(r);
    setResult(r);
    setSavedId(entry.id);
    setSaved(false);
  }

  function handleSave() {
    if (!savedId) return;
    toggleHistorySaved(savedId);
    setSaved((s) => !s);
  }

  function scrollToScan() {
    setActiveTab("barcode");
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-glutify-cream text-glutify-ink">
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="flex items-center justify-between">
          <p className="text-2xl font-extrabold tracking-tight">
            glut<span className="text-glutify-lime-deep">ify</span>
          </p>
          <button
            onClick={scrollToScan}
            className="rounded-full bg-glutify-ink px-5 py-2.5 text-sm font-semibold text-glutify-lime transition hover:opacity-90"
          >
            Scan now
          </button>
        </header>

        <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-glutify-lime-soft to-glutify-lime p-8">
          <div className="relative z-10 max-w-sm">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Find foods you can eat.
            </h1>
            <p className="mt-3 text-glutify-ink/70">
              Scan a barcode, snap the label, or paste ingredients, and Glootie
              tells you in seconds if gluten&rsquo;s hiding in there.
            </p>
          </div>
          <div className="absolute right-6 top-8 flex flex-col items-center gap-4">
            <span className="rounded-full bg-glutify-ink px-4 py-1.5 text-xs font-bold tracking-wide text-glutify-lime">
              GLUTEN CHECK
            </span>
            <Mascot className="h-28 w-28 sm:h-32 sm:w-32" />
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2 rounded-full bg-glutify-card p-1.5 shadow-sm ring-1 ring-black/5">
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-glutify-ink text-glutify-lime"
                    : "text-glutify-ink/50 hover:text-glutify-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <div ref={cardRef} className="mt-6 rounded-3xl bg-glutify-card p-6 shadow-sm ring-1 ring-black/5">
          {activeTab === "barcode" && <BarcodeTab onResult={handleResult} />}
          {activeTab === "photo" && <PhotoLabelTab onResult={handleResult} />}
          {activeTab === "text" && <TextTab onResult={handleResult} />}
          {activeTab === "guide" && <GuideTab />}
          {activeTab === "spots" && <SpotsTab />}
          {activeTab === "history" && <HistoryTab />}

          <div className="mt-8 border-t border-black/10 pt-6 text-center">
            <button
              onClick={() => setShowFeedback(true)}
              className="text-sm font-medium text-glutify-ink/70 underline decoration-glutify-ink/30 underline-offset-4 hover:text-glutify-ink"
            >
              Found something wrong? Send feedback
            </button>
            <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-glutify-ink/50">
              <span className="font-semibold text-glutify-ink/70">Important:</span> Glutify
              is an informational tool, not medical advice and not a
              substitute for reading the actual product label. It checks
              ingredient text against a keyword list and can be wrong,
              incomplete, or out of date. It does not detect
              cross-contamination and cannot guarantee a product is safe.
              Always read the physical label, confirm with the manufacturer,
              and if you have celiac disease or a food allergy, follow the
              guidance of a qualified medical professional. You use Glutify
              at your own risk.
            </p>
          </div>
        </div>

        {SCAN_TABS.includes(activeTab) && (
          <div className="mt-6">
            <ResultCard result={result} onSave={result ? handleSave : undefined} saved={saved} />
          </div>
        )}
      </div>
    </div>
  );
}
