import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart & Checkout | ShuBox Industrial",
  description: "Review your industrial electrical box order and checkout via bank transfer or Razorpay secure payment.",
  robots: { index: false }, // don't index the cart page
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
