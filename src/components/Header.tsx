"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingCart, Settings, Search, Briefcase, UserCircle2, Phone, Factory } from "lucide-react";
import type { UserJwtPayload } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Header({ user, phoneOne, phoneTwo }: { user: UserJwtPayload | null, phoneOne?: string, phoneTwo?: string }) {
  const { totalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
    {/* Universal Announcement Bar */}
    <div className="bg-accent-orange text-white py-2 px-4 shadow-sm">
       <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-center mb-0 leading-none">
          FREE DELIVERY ON ORDERS ABOVE ₹5000 | FACTORY DIRECT PRICING
       </p>
    </div>

    <div className="bg-slate-900 text-slate-300 py-1.5 px-4 sm:px-6 lg:px-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex justify-between items-center">
      <div>India's Premium Modular Box Manufacturer</div>
      <div className="flex items-center gap-4">
         {phoneOne && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-accent-orange" /> {phoneOne}</div>}
         {phoneTwo && <div className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3 text-accent-orange" /> {phoneTwo}</div>}
      </div>
    </div>
    <header
      className={`bg-white text-slate-gray-dark sticky top-0 z-50 border-b-2 transition-all duration-300 ${
        scrolled
          ? "shadow-xl border-slate-300"
          : "shadow-none border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-accent-orange text-white w-10 h-10 rounded-sm flex items-center justify-center font-black text-xl tracking-wider shadow group-hover:bg-accent-orange-hover transition-colors">
                  SB
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 m-0 leading-none uppercase font-sans">
                    ShuBox
                  </h1>
                  <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
                    Industrial Grade
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Smart Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative w-96">
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search G.I. Boxes, Modules..." 
                 className="w-full bg-slate-100 border border-slate-300 text-sm rounded-l-md pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-accent-orange focus:border-accent-orange transition-colors text-slate-800 font-medium"
               />
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  type="submit" 
                  className="bg-accent-orange hover:bg-accent-orange-hover text-white px-4 rounded-r-md flex items-center justify-center transition-colors"
                >
                   <Search className="w-4 h-4 font-bold" />
                </motion.button>
            </form>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
              <Link 
                 href="/about" 
                 className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-accent-orange transition-colors border border-slate-300 hover:border-accent-orange rounded-md px-4 py-2 uppercase tracking-wide"
                 title="Factory Profile & Manufacturing"
              >
                <Factory className="w-4 h-4" />
                <span>Factory Profile</span>
              </Link>
            </motion.div>

            {user ? (
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                <Link
                  href="/profile"
                  className="text-slate-600 hover:text-accent-orange transition-colors p-2 flex items-center gap-2 text-sm font-bold"
                >
                  <UserCircle2 className="w-6 h-6" />
                  <span className="hidden sm:inline tracking-wider">Hi, {user.fullName.split(' ')[0]}</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-accent-orange transition-colors p-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                  <UserCircle2 className="w-6 h-6" />
                  <span className="hidden sm:inline">Login / Register</span>
                </Link>
              </motion.div>
            )}
          
            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
              <Link
                href="/admin"
                className="text-slate-500 hover:text-slate-800 transition-colors p-2 flex items-center gap-1 text-sm font-bold uppercase tracking-wide"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
              <Link
                href="/cart"
                className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent-orange rounded-full shadow border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
           <div className="flex relative w-full">
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 className="w-full bg-slate-100 border border-slate-300 text-sm rounded-l-md pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-accent-orange focus:border-accent-orange text-slate-800"
               />
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  className="bg-accent-orange text-white px-4 rounded-r-md flex items-center justify-center"
                >
                   <Search className="w-4 h-4 font-bold" />
                </motion.button>
           </div>
        </div>
      </div>
    </header>
    </>
  );
}
