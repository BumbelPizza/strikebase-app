import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google"; // Wir nutzen stabile Google Fonts
import "./globals.css";
import Navbar from "@/components/Navbar";

// Inter für normalen Text (lesbar)
const inter = Inter({ subsets: ["latin"] });

// Oswald für Überschriften (Kampfsport-Look)
const oswald = Oswald({ 
  subsets: ["latin"], 
  variable: '--font-oswald' // Damit wir es in Tailwind nutzen können
});

export const metadata: Metadata = {
  title: "StrikeBase",
  description: "The ultimate fighter database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${oswald.variable} bg-zinc-950 text-zinc-100 pt-20`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}