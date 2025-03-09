import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoRugz | Marketplace",
  description: "Browse and trade meme coins",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
