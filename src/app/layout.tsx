import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { getSession } from "@/lib/auth";
import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop G.I. M.S. Modular Boxes | ShuBox Industrial",
  description: "Manufacturer of high-quality G.I. M.S. Modular Boxes. Order online with bulk pricing options.",
  verification: {
    google: "google-site-verification-placeholder-12345", // REPLACE WITH YOUR ACTUAL CODE
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  // Default fallback if DB hasn't seeded yet
  let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = {
      id: 1, businessName: "Shubham Enterprise", brandName: "SHUBOX",
      gstin: "19EAOPP6239Q1ZH", address: "41, Tangra Road, Kolkata - 700 015",
      phoneOne: "+91 9830234950", phoneTwo: "+91 6290754634", email: "siyarampanjiyara@gmail.com",
      bankName: "Bandhan Bank", bankBranch: "C I T Road", accountNo: "10220004937961", ifscCode: "BDBL0001843"
    };
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <CartProvider>
          <Header user={session} phoneOne={settings.phoneOne} phoneTwo={settings.phoneTwo} />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t-4 border-accent-orange">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
               <div className="mb-4 md:mb-0 text-left line-height-relaxed text-slate-500">
                 &copy; {new Date().getFullYear()} <strong className="text-slate-300">{settings.businessName}</strong>. <br className="md:hidden" /> All rights reserved.
                 <div className="mt-2 text-xs">
                   GSTIN: {settings.gstin} <br/>
                   Reg. Address: {settings.address}
                 </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
                   <ShieldCheck className="w-5 h-5 text-green-500" />
                   <span className="text-white font-bold tracking-widest uppercase text-xs">Verified Manufacturer</span>
                 </div>
               </div>
            </div>
          </footer>
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
