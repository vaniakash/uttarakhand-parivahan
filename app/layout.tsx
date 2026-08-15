import type { Metadata } from "next";
import { Yatra_One, Space_Mono } from "next/font/google";
import { PlayerProvider } from "@/context/PlayerContext";
import YouTubeEngine from "@/components/Player/YouTubeEngine";
import "./globals.css";

const yatraOne = Yatra_One({
  weight: "400",
  subsets: ["devanagari"],
  variable: "--font-yatra",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Uttarakhand Parivahan",
  description: "Curated Garhwali music player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${yatraOne.variable} ${spaceMono.variable} antialiased bg-[#e6e2d3] text-[#3e2723]`}>
        <PlayerProvider>
          {children}
          <YouTubeEngine />
        </PlayerProvider>
      </body>
    </html>
  );
}
