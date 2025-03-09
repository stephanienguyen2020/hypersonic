import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist | NoRugz",
  description: "Track your favorite meme coins",
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
