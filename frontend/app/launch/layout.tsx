import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoRugz | Launch Tokens",
  description: "Create and launch your own tokens",
};

export default function LaunchTokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
