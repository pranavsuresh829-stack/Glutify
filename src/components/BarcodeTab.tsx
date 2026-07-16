"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { lookupBarcode } from "../lib/openFoodFacts";
import { BARCODE_PATTERN, decodeBarcodeFromFile, hasValidChecksum } from "../lib/barcodeScan";
import { CheckResult } from "../lib/types";
import type { IScannerControls } from "@zxing/browser";

const CODE_PATTERN = BARCODE_PATTERN;

export default function BarcodeTab({
  onResult,
}: {
  onResult: (result: CheckResult) => void;
}) {
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(false);

  const controlsRef = useRef<IScannerControls | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  async function runLookup(code: string) {
    setStatus(`Looking up ${code}…`);
    const { result, statusMessage } = await lookupBarcode(code);
    setStatus(statusMessage);
    if (result) onResult(result);
  }

  async function startScanner() {
    if (scanning) return;

    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setStatus(
        'Live camera isn\'t available in this view. Use "Scan Barcode From Photo" below. It works everywhere.'
      );
      return;
    }

    setStatus("Starting camera…");

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const { BarcodeFormat, DecodeHintType } = await import("@zxing/library");
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
      ]);
      const reader = new BrowserMultiFormatReader(hints);
      setStatus("Requesting camera…");

      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current ?? undefined,
        (result) => {
          if (!result) return;
          const code = result.getText().trim();
          if (!CODE_PATTERN.test(code) || !hasValidChecksum(code)) return;
          setStatus("Barcode found. Looking up…");
          stopScanner();
          runLookup(code);
        }
      );
      controlsRef.current = controls;
      setScanning(true);
      setStatus("Point the camera at the barcode, about 10–15cm away. Steady hands help.");
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStatus('Camera permission was blocked. Allow camera in your browser, or use "Scan Barcode From Photo" below.');
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setStatus('No usable camera found. Use "Scan Barcode From Photo" below, or type the number.');
      } else {
        setStatus(
          `Live camera couldn't start here${err instanceof Error && err.message ? ` (${err.message})` : ""}. Use "Scan Barcode From Photo" below. It works everywhere.`
        );
      }
      controlsRef.current = null;
    }
  }

  function stopScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopScanner();
    setStatus("Reading barcode from photo…");
    try {
      const code = await decodeBarcodeFromFile(file, "fileScanRegion");
      if (!code) {
        setStatus("Couldn't find a barcode in that photo. Fill the frame with just the barcode, keep it in focus and level, then try again, or type the number below.");
        return;
      }
      await runLookup(code);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleManualLookup() {
    const code = manualCode.replace(/\s/g, "");
    if (!CODE_PATTERN.test(code)) {
      setStatus("That doesn't look like a product barcode. It should be 8 to 14 digits.");
      return;
    }
    runLookup(code);
  }

  return (
    <div>
      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Live Camera Scan
      </h2>
      <div className="overflow-hidden rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`aspect-video w-full object-cover ${scanning ? "block" : "hidden"}`}
        />
      </div>
      <button
        onClick={startScanner}
        className={`mt-3 w-full rounded-full bg-glutify-ink py-4 text-[14.5px] font-extrabold tracking-tight text-glutify-lime transition active:scale-[0.98] ${scanning ? "hidden" : ""}`}
      >
        Start Camera
      </button>
      <button
        onClick={() => {
          stopScanner();
          setStatus("");
        }}
        className={`mt-3 w-full rounded-full border-[1.5px] border-glutify-line bg-transparent py-3 text-[13.5px] font-bold text-glutify-ink transition hover:border-glutify-ink ${scanning ? "" : "hidden"}`}
      >
        Stop Camera
      </button>
      <div className="mt-2.5 min-h-[16px] text-[12.5px] font-semibold text-glutify-ink-dim">
        {status}
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-glutify-ink-dim">
        <div className="h-px flex-1 bg-glutify-line" />
        or
        <div className="h-px flex-1 bg-glutify-line" />
      </div>

      <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wide text-glutify-ink-dim">
        Scan Barcode From Photo
      </h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
        id="barcode-photo-input"
      />
      <label
        htmlFor="barcode-photo-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-glutify-line bg-glutify-panel-2 py-9 text-center text-[13.5px] font-semibold text-glutify-ink-dim transition hover:border-glutify-lime-deep hover:bg-glutify-lime-soft hover:text-glutify-ink"
      >
        <Upload className="h-4 w-4" />
        Tap to photograph or upload the barcode
      </label>
      <div id="fileScanRegion" className="hidden" />
      <div className="mt-2 text-[11.5px] text-glutify-ink-dim">
        Works everywhere, even when live camera is blocked. Get the barcode in focus, filling most of the frame.
      </div>

      <div className="mt-3.5 flex gap-2 border-t border-dashed border-glutify-line pt-3.5">
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
          inputMode="numeric"
          placeholder="Or type the barcode number"
          className="font-mono min-w-0 flex-1 rounded-full border-[1.5px] border-glutify-line bg-glutify-panel-2 px-4 py-3 text-sm text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <button
          onClick={handleManualLookup}
          className="flex-shrink-0 rounded-full border-[1.5px] border-glutify-ink bg-glutify-ink px-5 py-3 text-[13px] font-extrabold text-glutify-lime"
        >
          Look up
        </button>
      </div>
      <div className="mt-2 text-[11.5px] text-glutify-ink-dim">
        The number printed under the barcode, usually 12 or 13 digits.
      </div>
    </div>
  );
}
