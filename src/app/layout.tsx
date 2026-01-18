import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Using system fonts for better performance and reliability
const inter = {
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  variable: '--font-inter'
};

const oswald = {
  style: {
    fontFamily: '"Oswald", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  variable: '--font-oswald'
};

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