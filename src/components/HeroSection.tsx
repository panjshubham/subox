"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ease = [0.25, 0.1, 0.25, 1] as const; // easeOut cubic-bezier

export function HeroSection() {
  return (
    <div className="bg-slate-900 border-b-4 border-accent-orange text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-900 to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Badge — fade in from top, delay 0s */}
        <motion.span
          variants={fadeDown}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, ease, delay: 0 }}
          className="text-accent-orange font-black tracking-widest uppercase text-xs mb-4 inline-block bg-accent-orange/10 px-3 py-1 rounded border border-accent-orange/20"
        >
          Professional Grade Series
        </motion.span>

        {/* Headline line 1 — fade in from left, delay 0.2s */}
        <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
          <motion.span
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="block"
          >
            Engineered To Last.
          </motion.span>

          {/* Headline line 2 — fade in from left, delay 0.4s */}
          <motion.span
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, ease, delay: 0.4 }}
            className="block text-slate-400"
          >
            Built For Industry.
          </motion.span>
        </h2>

        {/* Description — fade in from bottom, delay 0.6s */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, ease, delay: 0.6 }}
          className="text-lg text-slate-300 mb-8 max-w-2xl font-medium"
        >
          Explore our high-grade G.I. and M.S. Modular Boxes. Weldless fabrication and
          rust-resistant coatings ensure unparalleled safety and durability for heavy-duty
          electrical installations.
        </motion.p>

        {/* CTA buttons — fade in from bottom, delay 0.8s */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, ease, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
            <Link
              href="/search"
              className="block bg-accent-orange text-white font-bold uppercase tracking-widest px-8 py-4 rounded-none shadow hover:bg-accent-orange-hover transition-colors text-center text-sm"
            >
              Shop Now
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
            <Link
              href="/contact"
              className="block bg-transparent border-2 border-slate-400 text-slate-300 font-bold uppercase tracking-widest px-8 py-4 rounded-none hover:border-white hover:text-white transition-colors text-center text-sm"
            >
              View Catalogue
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
