"use client";

import { useState } from "react";

const WEB3FORMS_ACCESS_KEY = "3dec7ef1-6a40-4f79-9066-f405ab304cc9";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(false);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const msg = message.trim();
    if (!msg) return;
    if (email && !EMAIL_PATTERN.test(email)) {
      setStatus("That email doesn't look right. Fix it, or leave it blank.");
      return;
    }
    setSending(true);
    setStatus("Sending…");
    try {
      const payload: Record<string, string> = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New Glutify feedback",
        from_name: name ? `${name} (via Glutify)` : "Glutify app",
        message: `${msg}\n\n---\nFrom: ${name || "anonymous"}\nEmail: ${email || "not provided"}`,
        botcheck: honeypot ? "true" : "",
      };
      if (email) payload.replyto = email;

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Thanks, got it.");
        setMessage("");
        setName("");
        setEmail("");
        setTimeout(onClose, 1000);
      } else {
        setStatus("Could not send. Try again.");
      }
    } catch {
      setStatus("Could not send. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-glutify-ink/50">
      <div className="w-full max-w-[560px] animate-fade-up rounded-t-[26px] bg-glutify-panel px-[22px] pb-7 pt-6">
        <h3 className="font-display text-lg font-extrabold">Send feedback</h3>
        <p className="mb-3.5 mt-1 text-[12.5px] text-glutify-ink-dim">
          Wrong ingredient flag, a bug, a feature idea, whatever it is.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's up?"
          className="mb-2.5 min-h-[90px] w-full resize-y rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 p-3.5 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="mb-2.5 w-full rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional, if you want a reply)"
          className="mb-2.5 w-full rounded-2xl border-[1.5px] border-glutify-line bg-glutify-panel-2 px-3.5 py-3 text-[13.5px] text-glutify-ink placeholder:text-glutify-ink-dim/60 focus:outline-none focus:border-glutify-lime-deep"
        />
        <label className="absolute left-[-9999px]" aria-hidden="true">
          <input
            type="checkbox"
            checked={honeypot}
            onChange={(e) => setHoneypot(e.target.checked)}
            tabIndex={-1}
            autoComplete="off"
          />
          Leave blank
        </label>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-[1.5px] border-glutify-line py-3 text-[13.5px] font-bold text-glutify-ink hover:border-glutify-ink"
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={!message.trim() || sending}
            className="flex-1 rounded-full bg-glutify-ink py-3 text-[13.5px] font-extrabold tracking-tight text-glutify-lime transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
        {status && <div className="mt-2.5 text-[12.5px] font-semibold text-glutify-ink-dim">{status}</div>}
      </div>
    </div>
  );
}
