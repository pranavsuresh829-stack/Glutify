"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Loader2, ScanLine, Upload } from "lucide-react";
import { lookupBarcode } from "../lib/openFoodFacts";
import { CheckResult } from "../lib/types";
import type { IScannerControls } from "@zxing/browser";

export default function BarcodeTab({
  onResult,
}: {
  onResult: (result: CheckResult) => void;
}) {
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  async function runLookup(code: string) {
    setError(null);
    setLoading(true);
    try {
      const result = await lookupBarcode(code, "barcode");
      onResult(result);
    } catch (e) {
      if (e instanceof TypeError) {
        setError("Network error — check your connection and try again.");
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong looking that up.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function startCamera() {
    setCameraError(null);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      setCameraActive(true);
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current ?? undefined,
        (result) => {
          if (result) {
            stopCamera();
            runLookup(result.getText());
          }
        }
      );
      controlsRef.current = controls;
    } catch {
      setCameraActive(false);
      setCameraError(
        "Couldn't access the camera. Check permissions, or use photo/manual entry instead."
      );
    }
  }

  function stopCamera() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraActive(false);
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    const url = URL.createObjectURL(file);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(url);
      await runLookup(result.getText());
    } catch {
      setError("Couldn't find a barcode in that photo. Try a clearer, closer shot.");
      setLoading(false);
    } finally {
      URL.revokeObjectURL(url);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
          Live Camera Scan
        </h2>
        <div className="mt-2 border-t border-black/10" />

        {cameraActive && (
          <div className="mt-4 overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
          </div>
        )}

        <div className="mt-4">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="w-full rounded-full bg-glutify-ink py-3.5 font-semibold text-glutify-lime transition hover:opacity-90"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full rounded-full bg-glutify-ink/10 py-3.5 font-semibold text-glutify-ink transition hover:bg-glutify-ink/15"
            >
              Stop Camera
            </button>
          )}
        </div>
        {cameraError && <p className="mt-2 text-sm text-rose-600">{cameraError}</p>}
      </div>

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-glutify-ink/40">
        <div className="h-px flex-1 bg-black/10" />
        or
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-glutify-ink/50">
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
          className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-black/20 bg-glutify-cream py-8 text-sm font-medium text-glutify-ink/70 transition hover:border-glutify-lime-deep hover:text-glutify-ink"
        >
          <Upload className="h-4 w-4" />
          Tap to photograph or upload the barcode
        </label>
        <p className="mt-2 text-sm text-glutify-ink/50">
          Works everywhere, even when live camera is blocked. Get the barcode
          in focus, filling most of the frame.
        </p>

        <div className="mt-4 border-t border-black/10 pt-4">
          <div className="flex gap-2">
            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="e.g. 0037466051200"
              inputMode="numeric"
              className="flex-1 rounded-full bg-glutify-cream px-4 py-3 text-sm text-glutify-ink placeholder:text-glutify-ink/30 focus:outline-none focus:ring-2 focus:ring-glutify-lime-deep"
            />
            <button
              onClick={() => runLookup(manualCode)}
              disabled={!manualCode.trim() || loading}
              className="flex items-center gap-2 rounded-full bg-glutify-ink px-5 font-semibold text-glutify-lime transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
              Look up
            </button>
          </div>
          <p className="mt-2 text-sm text-glutify-ink/50">
            The number printed under the barcode, usually 12 or 13 digits.
          </p>
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
