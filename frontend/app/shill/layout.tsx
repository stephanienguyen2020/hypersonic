import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoRugz | Shill Manager",
  description: "Manage your token promotion campaigns",
};

export default function ShillManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
