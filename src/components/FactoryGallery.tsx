"use client";

import { motion } from "framer-motion";
import { Factory } from "lucide-react";

const images = [
  {
    src: "/factory-1.png",
    alt: "Industrial Punch Press Machine at Tangra Road Facility",
    badge: "Unit 01",
    caption: "Industrial Punch Press Machines",
    sub: "Tangra Road Facility · Kolkata",
  },
  {
    src: "/factory-2.png",
    alt: "Metal Fabrication Production Floor at Tangra Road Facility",
    badge: "Unit 02",
    caption: "Industrial Punch Press Machines",
    sub: "Tangra Road Facility · Kolkata",
  },
];

export function FactoryGallery() {
  return (
    <div className="mb-24">
      {/* Section header — fades in from bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-12"
      >
        <span className="text-accent-orange font-black tracking-widest uppercase text-xs inline-block bg-accent-orange/10 px-3 py-1 rounded border border-accent-orange/20 mb-4">
          Kolkata, West Bengal
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-widest mb-4">
          Our Manufacturing Unit
        </h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          State-of-the-art punch press machines at our Tangra Road, Kolkata
          facility
        </p>
      </motion.div>

      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: i * 0.15,
            }}
            /* overflow-hidden + group = hover zoom container */
            className="relative overflow-hidden rounded-lg shadow-xl group aspect-video cursor-pointer"
          >
            {/* Image — zooms in on hover */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Dark overlay — fades in on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end pointer-events-none">
              {/* Caption slides up slightly on hover */}
              <div className="p-6 border-l-4 border-accent-orange translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-white font-black uppercase tracking-wider text-sm leading-tight">
                  {img.caption}
                </p>
                <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px] mt-1">
                  {img.sub}
                </p>
              </div>
            </div>

            {/* Corner badge — always visible */}
            <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-sm text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-slate-700 z-10">
              {img.badge}
            </div>

            {/* Subtle orange border glow on hover */}
            <div className="absolute inset-0 rounded-lg ring-0 group-hover:ring-2 group-hover:ring-accent-orange/40 transition-all duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Production statement — fades in last */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        className="bg-slate-900 rounded-xl p-8 border-l-8 border-accent-orange flex flex-col md:flex-row items-center gap-6"
      >
        <div className="w-14 h-14 bg-accent-orange/10 border border-accent-orange/30 rounded flex items-center justify-center shrink-0">
          <Factory className="w-7 h-7 text-accent-orange" />
        </div>
        <p className="text-slate-300 font-medium leading-relaxed text-center md:text-left">
          All products are manufactured in-house using heavy-duty punch press
          machinery ensuring consistent quality and precision in every unit.
        </p>
      </motion.div>
    </div>
  );
}
