import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KSA Disaster Dashboard",
  description: "A geospatial monitoring dashboard for map data, study topics, and areas of interest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
