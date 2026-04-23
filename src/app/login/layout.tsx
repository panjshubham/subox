import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contractor Login | ShuBox Industrial",
  description: "Login to your ShuBox business account to view wholesale pricing, track orders, and manage invoices.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
