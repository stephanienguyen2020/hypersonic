"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWallet } from "./providers/WalletProvider";
import { AppLayout } from "./components/app-layout";
import StarfieldBackground from "./components/GridBackground";
import { Button } from "@/components/ui/button";

export default function Home(): JSX.Element {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(isConnected || savedAuth);

    // If authenticated, redirect to dashboard
    if (isConnected || savedAuth) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  // Function to handle the "Connect Wallet" button click
  const handleConnectWallet = async () => {
    try {
      // If not connected, try to connect wallet
      if (!isConnected) {
        await connect();
        // The WalletProvider will handle redirection to dashboard after successful connection
      } else {
        // If already connected, just navigate to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      router.push("/dashboard");
    }
  };

  return (
    <AppLayout showFooter={false}>
      {/* Starfield Background */}
      <StarfieldBackground />

      {/* Main Content */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        <section className="w-full flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <div className="py-16 md:py-24 max-w-3xl w-full text-center space-y-8">
              {/* New badge */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm">
                  <span className="bg-gradient-to-r from-[#E4067C] to-[#ff3b9e] text-white text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                  <span className="flex items-center gap-2 text-white">
                    Multi-AI Agent Framework for Market Prediction, Smart
                    Trading, Token Launching & On-Chain Betting
                  </span>
                </div>
              </div>

              {/* Hero content */}
              <div className="space-y-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
                  <span className="relative">
                    <span className="text-white">HYPER</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4067C] to-[#ff3b9e] hover:glow relative">
                      SONIC
                      <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-[#E4067C] to-[#ff3b9e] transform scale-x-0 transition-transform group-hover:scale-x-100"></div>
                    </span>
                    {/* Add subtle glow behind the text */}
                    <div className="absolute -inset-2 bg-[#E4067C] opacity-10 blur-xl rounded-full"></div>
                  </span>
                </h1>
                <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto">
                  Built on Sonic - the high-performance EVM blockchain built for
                  DeFi and Web3 innovation
                </p>
                <div className="flex justify-center gap-6 mt-8">
                  <Button
                    size="lg"
                    className="relative group overflow-hidden px-8 py-6 rounded-xl bg-gradient-to-r from-[#E4067C] to-[#ff3b9e] transform hover:scale-105 transition-all duration-200"
                    onClick={handleConnectWallet}
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-200"></div>
                    <div className="relative flex items-center gap-3">
                      <span className="text-lg font-semibold text-white">
                        Connect Wallet
                      </span>
                      <svg
                        className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#E4067C] to-[#ff3b9e] opacity-30 blur group-hover:opacity-50 transition-opacity"></div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add the glow animation styles */}
        <style jsx global>{`
          @keyframes glow {
            0% {
              text-shadow: 0 0 15px rgba(228, 6, 124, 0.3),
                0 0 30px rgba(228, 6, 124, 0.2);
            }
            50% {
              text-shadow: 0 0 25px rgba(228, 6, 124, 0.5),
                0 0 50px rgba(255, 59, 158, 0.3);
            }
            100% {
              text-shadow: 0 0 15px rgba(228, 6, 124, 0.3),
                0 0 30px rgba(228, 6, 124, 0.2);
            }
          }

          .hover\\:glow:hover {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
