"use client";

import { MiniMascot } from "./Mascot";

export default function ConsentModal({ onAck }: { onAck: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-glutify-ink/55 p-5">
      <div className="w-full max-w-[400px] animate-fade-up rounded-3xl bg-glutify-panel px-6 py-7 text-center">
        <div className="mb-3 flex justify-center">
          <MiniMascot size={56} mood="safe" />
        </div>
        <h3 className="font-display mb-2.5 text-xl font-extrabold">Before you start</h3>
        <p className="mb-3 text-[13px] leading-relaxed text-glutify-ink-dim">
          Glutify helps you spot gluten in ingredient lists, but it&apos;s an informational tool, not
          medical advice. It can be wrong or incomplete, and it can&apos;t detect cross-contamination or
          guarantee a product is safe.
        </p>
        <p className="mb-3 text-[13px] font-semibold leading-relaxed text-glutify-ink">
          Always read the real label and, if you have celiac disease or an allergy, follow your
          doctor&apos;s guidance. You use Glutify at your own risk.
        </p>
        <button
          onClick={onAck}
          className="mt-1.5 w-full rounded-full bg-glutify-ink py-4 text-[14.5px] font-extrabold tracking-tight text-glutify-lime transition active:scale-[0.98]"
        >
          I understand
        </button>
      </div>
    </div>
  );
}
