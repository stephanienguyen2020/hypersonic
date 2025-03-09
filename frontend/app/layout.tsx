import type React from "react";
import { Press_Start_2P, VT323 } from "next/font/google";
import MatrixBackground from "./components/GridBackground";
import SoundEffect from "./components/SoundEffect";
import { Metadata } from "next";
import { Providers } from "./providers";
import { SiteHeader } from "./components/site-header";
import { cn } from "@/lib/utils";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "NoRugz",
  description: "AI-powered meme coin platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-gray-900 font-sans antialiased text-retro-green",
          monaSans.variable,
          pressStart2P.variable,
          vt323.variable
        )}
      >
        <MatrixBackground />
        <Providers>{children}</Providers>
        <SoundEffect />
      </body>
    </html>
  );
}
