"use client";

import { useState } from "react";
import { X } from "lucide-react";

const FEEDBACK_EMAIL = "pranavsuri829@gmail.com";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function send() {
    const subject = encodeURIComponent("Glutify feedback");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-glutify-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-glutify-ink">Send feedback</h2>
          <button onClick={onClose} className="text-glutify-ink/40 hover:text-glutify-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-glutify-ink/50">
          Wrong ingredient flag, a bug, a feature idea — whatever it is.
        </p>
        {sent ? (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
            Thanks — your email app should be open. Send it over and Glootie
            will take a look.
          </p>
        ) : (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="What happened?"
              className="mt-4 w-full resize-none rounded-2xl bg-glutify-cream p-3 text-sm text-glutify-ink placeholder:text-glutify-ink/30 focus:outline-none focus:ring-2 focus:ring-glutify-lime-deep"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-glutify-ink/60 hover:text-glutify-ink"
              >
                Cancel
              </button>
              <button
                onClick={send}
                disabled={!message.trim()}
                className="rounded-full bg-glutify-ink px-4 py-2 text-sm font-semibold text-glutify-lime transition hover:opacity-90 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
