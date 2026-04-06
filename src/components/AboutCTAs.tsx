"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AboutCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
      <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
        <Link 
          href="/register" 
          className="bg-accent-orange hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded transition-colors shadow-lg inline-block w-full text-center"
        >
          Create Business Account
        </Link>
      </motion.div>
      <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
        <Link 
          href="/" 
          className="bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded transition-colors backdrop-blur inline-block w-full text-center"
        >
          View Catalog
        </Link>
      </motion.div>
    </div>
  );
}
