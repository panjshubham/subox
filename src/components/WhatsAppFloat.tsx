"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.phoneOne) {
          setPhoneNumber(data.phoneOne.replace(/\D/g, ""));
        }
      })
      .catch((err) => console.error("Could not load WhatsApp number", err));
  }, []);

  if (!phoneNumber) return null;

  const defaultMessage = "Hi, I want to enquire about your products.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Ripple ring — expands outward, loops continuously */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.6],
          opacity: [0.45, 0],
        }}
        transition={{
          duration: 1.8,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 1.2, // pause between ripples → ~3s total cycle
        }}
      />

      {/* Button — gentle scale pulse every 3s */}
      <motion.a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.5, // 0.5s pulse + 2.5s rest = 3s cycle
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full shadow-2xl group"
      >
        <MessageCircle className="w-8 h-8" />

        {/* Tooltip — appears on hover */}
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-black px-3 py-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest hidden md:flex items-center gap-2 border border-slate-700">
          <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
          Chat with Factory
        </span>
      </motion.a>
    </div>
  );
}
