"use client";

import { Printer, Download, ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PressButton } from "./PressButton";

export function InvoiceActions({ waLink }: { waLink: string }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-[21cm] flex justify-between items-center mb-6 print:hidden">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>
      
      <div className="flex gap-4">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link 
            href={waLink} 
            target="_blank" 
            className="bg-[#25D366] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 uppercase tracking-widest hover:bg-[#1ebd5a] shadow-md shadow-green-500/20 transition-colors"
          >
            <Send className="w-4 h-4" /> Send to Factory
          </Link>
        </motion.div>

        <PressButton 
          onClick={handlePrint}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2 uppercase tracking-widest hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Save PDF
        </PressButton>

        <PressButton 
          onClick={handlePrint}
          className="bg-accent-orange text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 uppercase tracking-widest hover:bg-accent-orange-hover transition-colors shadow-lg"
          aria-label="Print Invoice"
        >
          <Printer className="w-4 h-4" /> Print
        </PressButton>
      </div>
    </div>
  );
}
