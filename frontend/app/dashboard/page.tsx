"use client";

import { motion } from "framer-motion";
import { AppLayout } from "../components/app-layout";
import { BetsSection } from "./components/bets-section";
import { LaunchedTokens } from "./components/launched-tokens";
import { MemeNews } from "./components/meme-news";
import { AboutMemes } from "./components/about-memes";
import { useAccount } from "wagmi";
import { useWallet } from "../providers/WalletProvider";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="px-4 max-w-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 max-w-5xl mx-auto mt-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            Dashboard{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Overview
            </span>
          </h1>

          {/* Connected Wallet Display */}
          {walletAddress && (
            <div className="flex items-center gap-2 mt-2 md:mt-0 p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
              <Wallet className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Connected:</span>
              <span className="text-sm text-muted-foreground">
                {walletAddress.substring(0, 6)}...
                {walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Bottom Grid - Responsive layout that stacks on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/10 h-full">
              <BetsSection />
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/10 h-full">
              <LaunchedTokens />
            </div>
          </div>

          {/* News and About sections in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/10 h-full">
              <MemeNews />
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/10 h-full">
              <AboutMemes />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
