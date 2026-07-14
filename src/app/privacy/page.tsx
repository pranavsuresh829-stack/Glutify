import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Glutify",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-glutify-bg">
      <div className="mx-auto max-w-[560px] px-[22px] py-10">
        <Link href="/" className="text-[13px] font-bold text-glutify-ink-dim hover:text-glutify-ink">
          ← Back to Glutify
        </Link>

        <h1 className="font-display mt-4 text-[28px] font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-1 text-[12.5px] text-glutify-ink-dim">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-6 space-y-6 text-[13.5px] leading-relaxed text-glutify-ink">
          <section>
            <h2 className="font-display mb-2 text-base font-bold">The short version</h2>
            <p className="text-glutify-ink-dim">
              Glutify does not have user accounts, does not run analytics or ad tracking, and does not
              have a server database. Your scan history and safe spots stay on your own device. The
              only things that leave your device are: what you type into the feedback form, the
              barcode number when you look up a product, and a one-time download of the software that
              powers label reading (details below). Your photos themselves are never uploaded anywhere.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">What&apos;s stored on your device</h2>
            <p className="text-glutify-ink-dim">
              Your scan history, saved items, safe spots, and whether you&apos;ve acknowledged the
              disclaimer are all stored in your browser&apos;s local storage. This data never leaves
              your device and is not visible to us. Clearing your browser data or uninstalling the app
              deletes it permanently.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">Barcode lookups</h2>
            <p className="text-glutify-ink-dim">
              When you look up a barcode, the barcode number is sent to{" "}
              <a
                href="https://world.openfoodfacts.org"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-1 underline-offset-2 hover:text-glutify-ink-dim"
              >
                Open Food Facts
              </a>
              , a free, independent product database. No other information about you is sent with that
              request. See Open Food Facts&apos; own privacy policy for how they handle that request.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">Photo and camera use</h2>
            <p className="text-glutify-ink-dim">
              Photos you take or upload for barcode scanning or label reading are processed entirely in
              your browser. They are never uploaded to us or to any server. Once you leave the page,
              they&apos;re gone.
            </p>
            <p className="mt-3 text-glutify-ink-dim">
              To read text off a label, the Photo tab uses an on-device reading engine
              (Tesseract.js). The first time you use it, your browser downloads the reading software
              itself from a public CDN (jsdelivr), which sees your IP address the same way any website
              request does. Only that software is downloaded, never your photo or the text it reads.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">Feedback form</h2>
            <p className="text-glutify-ink-dim">
              If you send feedback, your message and any name or email you choose to provide are sent
              via Web3Forms to the developer&apos;s inbox, so we can read and, if you left an email,
              reply to it. That&apos;s the only reason we&apos;d have your email: you gave it to us on
              purpose. We don&apos;t add it to any list or use it for anything else.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">No tracking</h2>
            <p className="text-glutify-ink-dim">
              We don&apos;t use cookies, analytics, or advertising trackers, and we have no way to
              identify you or follow you across sites. The one exception is the CDN request described
              above when you first use the Photo tab, which is standard for how that software is
              distributed, not something we set up to track you.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">Changes</h2>
            <p className="text-glutify-ink-dim">
              If Glutify adds features that change what data is collected (for example, a shared
              database for Safe Spots), this page will be updated first.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-base font-bold">Contact</h2>
            <p className="text-glutify-ink-dim">
              Questions about this policy: reach out through the feedback form in the app, or email{" "}
              <a
                href="mailto:pranavsuri829@gmail.com"
                className="underline decoration-1 underline-offset-2 hover:text-glutify-ink-dim"
              >
                pranavsuri829@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
