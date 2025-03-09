"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWallet } from "./providers/WalletProvider";
import { AppLayout } from "./components/app-layout";
import { Button } from "@/components/ui/button";

export default function Home(): JSX.Element {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(isConnected || savedAuth);

    // If authenticated, redirect to marketplace
    if (isConnected || savedAuth) {
      router.push("/marketplace");
    }
  }, [isConnected, router]);

  // Function to handle the "Connect Wallet" button click
  const handleConnectWallet = async () => {
    try {
      // If not connected, try to connect wallet
      if (!isConnected) {
        await connect();
        // The WalletProvider will handle redirection to marketplace after successful connection
      } else {
        // If already connected, just navigate to marketplace
        router.push("/marketplace");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      router.push("/marketplace");
    }
  };

  return (
    <AppLayout showFooter={false}>
      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center z-10">
        <section className="w-full flex flex-col items-center justify-center py-20">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <div className="py-16 md:py-24 max-w-3xl w-full text-center space-y-8 bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-retro-green/20">
              {/* New badge */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm">
                  <span className="bg-gradient-to-r from-green-400 to-green-600 text-black text-xs px-2 py-0.5 rounded-full">
                    ONLY ON SONIC LABS
                  </span>
                </div>
              </div>

              {/* Hero content */}
              <div className="space-y-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                    NORUGZ
                  </span>
                </h1>
                <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto">
                  SIMPLIFY TOKEN LAUNCHING & MARKETING
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black rounded-full px-8 hover:glow font-pixel"
                    onClick={handleConnectWallet}
                  >
                    GET STARTED!
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
              text-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
            }
            50% {
              text-shadow: 0 0 10px rgba(74, 222, 128, 0.7),
                0 0 15px rgba(74, 222, 128, 0.5);
            }
            100% {
              text-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
            }
          }

          .hover\\:glow:hover {
            animation: glow 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
