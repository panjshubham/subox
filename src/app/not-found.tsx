import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Area Restricted | ShuBox Industrial",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full text-center">
        
        {/* Warning Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center mx-auto shadow-2xl border-4 border-accent-orange">
            <AlertTriangle className="w-14 h-14 text-accent-orange" />
          </div>
          {/* Flashing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-accent-orange animate-ping opacity-20" />
        </div>

        {/* Status code */}
        <div className="text-8xl font-black text-slate-200 leading-none mb-2 tracking-tighter">
          404
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-widest mb-3">
          Area Restricted
        </h1>
        <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
          The route you're looking for doesn't exist in our catalog.<br />
          It may have been moved or was never manufactured.
        </p>

        {/* Industrial divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SHUBOX INDUSTRIAL</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange-hover text-white font-black uppercase tracking-widest px-8 py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Store
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 border-2 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-800 font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact Support
          </Link>
        </div>

        {/* Bottom diagnostic text */}
        <p className="mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Error Code: HTTP/404 — Resource Not Found
        </p>
      </div>
    </div>
  );
}
