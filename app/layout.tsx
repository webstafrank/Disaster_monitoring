import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime dependency on Google's
// CDN, which matters for the on-prem deployment). Exposed as CSS variables
// consumed by globals.css (--font-inter / --font-space-grotesk).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "KSA · WFP Rangeland Intelligence Hub",
  description: "Geospatial intelligence dashboard for disaster monitoring, drought indicators, and ecosystem restoration across Kenya's ASALs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
