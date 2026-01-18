import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Inter for body text (readable)
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

// Oswald for headings (combat sports look)
const oswald = Oswald({
  subsets: ["latin"],
  variable: '--font-oswald'
});

export const metadata: Metadata = {
  title: "StrikeBase - Combat Sports Management",
  description: "The ultimate platform for fighter management, analysis, and combat sports intelligence.",
  keywords: "combat sports, MMA, kickboxing, fighter management, sports analytics",
  authors: [{ name: "StrikeBase Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#dc2626',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-inter bg-zinc-950 text-zinc-100 antialiased`}>
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}