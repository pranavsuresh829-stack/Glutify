import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const TITLE = "Glutify: Gluten's got nowhere to hide";
const DESCRIPTION =
  "Scan a barcode, snap the label, or paste the ingredients. Glootie finds what's hiding in there.";

export const metadata: Metadata = {
  metadataBase: new URL("https://glutify.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Glutify",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Glutify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#131309",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-glutify-bg text-glutify-ink antialiased">
        {children}
        <script
          defer
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "1bf5ce98d8b2404394c28ed032fc4264"}'
        />
      </body>
    </html>
  );
}
