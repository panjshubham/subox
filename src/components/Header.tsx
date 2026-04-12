"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import {
  ShoppingCart, Settings, Search, Factory, UserCircle2, Phone, Menu, X
} from "lucide-react";
import type { UserJwtPayload } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header({ user, phoneOne, phoneTwo }: { user: UserJwtPayload | null, phoneOne?: string, phoneTwo?: string }) {
  const { totalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Store" },
    { href: "/about", label: "Factory" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-accent-orange text-white py-2 px-4 shadow-sm">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-center leading-none">
          FREE DELIVERY ON ORDERS ABOVE ₹5000 | FACTORY DIRECT PRICING
        </p>
      </div>

      {/* Contact bar */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 sm:px-6 lg:px-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex justify-between items-center">
        <div>India's Premium Modular Box Manufacturer</div>
        <div className="flex items-center gap-4">
          {phoneOne && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-accent-orange" /> {phoneOne}</div>}
          {phoneTwo && <div className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3 text-accent-orange" /> {phoneTwo}</div>}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`bg-white sticky top-0 z-50 border-b-2 transition-all duration-300 ${
          scrolled ? "shadow-xl border-slate-300" : "shadow-none border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="bg-accent-orange text-white w-10 h-10 rounded-sm flex items-center justify-center font-black text-xl tracking-wider shadow group-hover:bg-accent-orange-hover transition-colors">
                    SB
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-black tracking-tight text-slate-800 m-0 leading-none uppercase">ShuBox</h1>
                    <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Industrial Grade</p>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop search */}
              <form onSubmit={handleSearch} className="hidden md:flex relative w-80 lg:w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search G.I. Boxes, Modules..."
                  className="w-full bg-slate-100 border border-slate-300 text-sm rounded-l-md pl-4 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-orange focus:border-accent-orange text-slate-800 font-medium"
                />
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="bg-accent-orange hover:bg-accent-orange-hover text-white px-4 rounded-r-md flex items-center justify-center transition-colors">
                  <Search className="w-4 h-4" />
                </motion.button>
              </form>
            </div>

            {/* Desktop right nav */}
            <div className="hidden md:flex items-center gap-4 sm:gap-6">
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                <Link href="/about" className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-accent-orange transition-colors border border-slate-300 hover:border-accent-orange rounded-md px-4 py-2 uppercase tracking-wide">
                  <Factory className="w-4 h-4" /> Factory Profile
                </Link>
              </motion.div>

              {user ? (
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link href="/profile" className="text-slate-600 hover:text-accent-orange transition-colors p-2 flex items-center gap-2 text-sm font-bold">
                    <UserCircle2 className="w-6 h-6" />
                    <span className="hidden sm:inline tracking-wider">Hi, {user.fullName.split(' ')[0]}</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link href="/login" className="text-slate-600 hover:text-accent-orange transition-colors p-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    <UserCircle2 className="w-6 h-6" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>
              )}

              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/admin" className="text-slate-500 hover:text-slate-800 transition-colors p-2">
                  <Settings className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/cart" className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent-orange rounded-full shadow border-2 border-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>

            {/* Mobile right side: cart + hamburger */}
            <div className="flex md:hidden items-center gap-3">
              <Link href="/cart" className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-accent-orange rounded-full shadow border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="p-2 text-slate-700 hover:text-accent-orange transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop: Mobile search (below header bar, visible on small screens) */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100 border border-slate-300 text-sm rounded-l-md pl-4 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-orange text-slate-800"
              />
              <button type="submit" className="bg-accent-orange text-white px-4 rounded-r-md flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <nav className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:text-accent-orange hover:bg-slate-50 rounded-lg font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  {user ? (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-accent-orange hover:bg-slate-50 rounded-lg font-bold uppercase tracking-wide text-sm transition-colors"
                    >
                      <UserCircle2 className="w-5 h-5" /> My Account
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-accent-orange hover:bg-slate-50 rounded-lg font-bold uppercase tracking-wide text-sm transition-colors"
                    >
                      <UserCircle2 className="w-5 h-5" /> Login / Register
                    </Link>
                  )}
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg font-bold uppercase tracking-wide text-sm transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
