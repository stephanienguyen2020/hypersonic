"use client";

import { ReactNode, useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function AppLayout({ children, showFooter = false }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SiteHeader />
      </div>

      {/* Main content area without sidebar */}
      <div className="flex pt-16 flex-grow">
        {/* Main Content - centered with max width */}
        <main className="flex-1 w-full mx-auto max-w-7xl">
          {children}

          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
