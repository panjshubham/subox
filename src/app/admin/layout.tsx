import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ShuBox Command Center",
  description: "ShuBox admin panel — manage products, orders, analytics and logistics.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
