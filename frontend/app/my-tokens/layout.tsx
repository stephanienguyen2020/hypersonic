import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoRugz | My Tokens",
  description: "Manage your token portfolio",
};

export default function MyTokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
