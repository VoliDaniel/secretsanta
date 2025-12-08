import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Space_Grotesk } from "next/font/google";

const festive = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-festive",
  weight: ["400", "600", "700"]
});

const warmth = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-warmth",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Secret Santa Scratch",
  description: "A festive scratch-calendar experience for Secret Santa reveals"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${festive.variable} ${warmth.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-pine via-[#0c2d18] to-[#0a2113] text-snow antialiased">
        <div
          aria-hidden
          className="noise-bg pointer-events-none fixed inset-0 mix-blend-soft-light opacity-60"
        />
        {children}
      </body>
    </html>
  );
}
