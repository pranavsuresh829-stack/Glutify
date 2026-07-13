"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConsentModal from "../components/ConsentModal";
import FeedbackModal from "../components/FeedbackModal";
import ResultCard from "../components/ResultCard";
import BarcodeTab from "../components/BarcodeTab";
import PhotoLabelTab from "../components/PhotoLabelTab";
import TextTab from "../components/TextTab";
import GuideTab from "../components/GuideTab";
import SpotsTab from "../components/SpotsTab";
import HistoryTab from "../components/HistoryTab";
import { HeroMascot } from "../components/Mascot";
import { CheckResult } from "../lib/types";
import { ackConsent, hasAckedConsent, saveScan, setHistorySaved } from "../lib/storage";

type TabId = "barcode" | "photo" | "text" | "guide" | "spots" | "history";

const TABS: { id: TabId; label: string }[] = [
  { id: "barcode", label: "Barcode" },
  { id: "photo", label: "Photo" },
  { id: "text", label: "Text" },
  { id: "guide", label: "Guide" },
  { id: "spots", label: "Spots" },
  { id: "history", label: "History" },
];

export default function GlutifyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("barcode");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setShowConsent(!hasAckedConsent());
  }, []);

  function selectTab(id: TabId) {
    setActiveTab(id);
    setResult(null);
  }

  function handleResult(r: CheckResult) {
    setResult(r);
    setCurrentScanId(saveScan(r));
    setSaved(false);
  }

  function handleToggleSaved() {
    if (!currentScanId) return;
    setHistorySaved(currentScanId, !saved);
    setSaved((s) => !s);
  }

  return (
    <div className="min-h-screen bg-glutify-bg">
      {showConsent && (
        <ConsentModal
          onAck={() => {
            ackConsent();
            setShowConsent(false);
          }}
        />
      )}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <div className="mx-auto max-w-[560px] pb-[70px]">
        <nav className="mx-auto flex max-w-[560px] animate-fade-up items-center justify-between px-[22px] pb-3.5 pt-5">
          <div className="font-display text-[23px] font-extrabold tracking-tight">
            glut<span className="text-glutify-lime-deep">ify</span>
          </div>
          <div className="rounded-full bg-glutify-ink px-[17px] py-2.5 text-[12.5px] font-bold text-glutify-lime">
            Scan now
          </div>
        </nav>

        <div
          className="relative mx-4 mb-6 mt-1 animate-fade-up overflow-hidden rounded-[30px] px-7 pb-[34px] pt-[38px] [animation-delay:80ms]"
          style={{ background: "linear-gradient(150deg, #d9f24b 0%, #ecf9ad 90%)" }}
        >
          <span className="absolute right-6 top-[26px] z-[1] rounded-full bg-glutify-ink px-3 py-[7px] text-[10.5px] font-extrabold uppercase tracking-wide text-glutify-lime">
            Gluten check
          </span>
          <div className="relative flex items-center gap-2.5">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[33px] font-extrabold leading-[0.96] tracking-tight sm:text-[38px]">
                Gluten&apos;s got nowhere to hide.
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#3a3a12]">
                Scan a barcode, snap the label, or paste the ingredients. Glootie finds what&apos;s
                hiding in there.
              </p>
            </div>
            <div className="flex w-28 flex-shrink-0 justify-center sm:w-[142px]">
              <HeroMascot className="h-[116px] w-[116px] sm:h-40 sm:w-40" />
            </div>
          </div>
        </div>

        <div className="mb-4 flex animate-fade-up gap-2 overflow-x-auto px-4 [animation-delay:160ms] [scrollbar-width:none]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full border-[1.5px] px-[18px] py-3 text-[13.5px] font-bold transition ${
                activeTab === t.id
                  ? "border-glutify-ink bg-glutify-ink text-glutify-lime"
                  : "border-glutify-line bg-glutify-panel text-glutify-ink-dim hover:border-glutify-ink hover:text-glutify-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mx-4 mb-4 animate-fade-up rounded-[20px] border-[1.5px] border-glutify-line bg-glutify-panel p-[22px] [animation-delay:160ms]">
          {activeTab === "barcode" && <BarcodeTab onResult={handleResult} />}
          {activeTab === "photo" && <PhotoLabelTab onResult={handleResult} />}
          {activeTab === "text" && <TextTab onResult={handleResult} />}
          {activeTab === "guide" && <GuideTab />}
          {activeTab === "spots" && <SpotsTab />}
          {activeTab === "history" && <HistoryTab />}
        </div>

        <div
          onClick={() => setShowFeedback(true)}
          className="mt-5 cursor-pointer text-center text-[12.5px] font-bold text-glutify-ink-dim underline decoration-1 underline-offset-[3px] hover:text-glutify-ink"
        >
          Found something wrong? Send feedback
        </div>

        {result && (
          <div className="mt-4">
            <ResultCard result={result} saved={saved} onToggleSaved={handleToggleSaved} />
          </div>
        )}

        <div className="mt-2.5 px-[26px] text-center text-[11.5px] leading-relaxed text-glutify-ink-dim">
          <strong className="text-glutify-ink">Important:</strong> Glutify is an informational tool,
          not medical advice and not a substitute for reading the actual product label. It checks
          ingredient text against a keyword list and can be wrong, incomplete, or out of date. It
          does not detect cross-contamination and cannot guarantee a product is safe. Always read
          the physical label, confirm with the manufacturer, and if you have celiac disease or a
          food allergy, follow the guidance of a qualified medical professional. You use Glutify at
          your own risk.
        </div>

        <Link
          href="/privacy"
          className="mt-3 block text-center text-[11.5px] font-bold text-glutify-ink-dim underline decoration-1 underline-offset-[3px] hover:text-glutify-ink"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
