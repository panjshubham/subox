"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

export function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border-b-4 border-accent-orange">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((p, i) => {
          const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          return (
            <div key={p.id} className="w-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-slate-900/60 to-transparent z-10 pointer-events-none" />
              
              {/* Product Background Image Blur */}
              {p.imageUrl ? (
                <div className="absolute inset-0 z-0">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover blur-2xl opacity-30" />
                </div>
              ) : (
                <div className="absolute inset-0 z-0 bg-slate-800" />
              )}
              
              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
                
                <div className="flex-1 text-white">
                   <div className="bg-red-600 text-white font-black px-4 py-1.5 rounded uppercase tracking-widest text-xs inline-flex items-center gap-2 mb-4 shadow-lg border border-red-500 shadow-red-500/20">
                     <Tag className="w-4 h-4" /> {discountPercent}% OFF LIVE DEAL
                   </div>
                   
                   <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter uppercase drop-shadow-md">
                     {p.name}
                   </h2>
                   
                   <p className="text-lg text-slate-300 font-medium mb-8 max-w-2xl line-clamp-2">
                     {p.description}
                   </p>
                   
                   <div className="flex items-center gap-6 mb-8">
                      <span className="text-5xl font-black text-white drop-shadow-lg">₹{p.price.toFixed(2)}</span>
                      <span className="text-2xl text-slate-400 line-through font-bold">₹{p.mrp.toFixed(2)}</span>
                   </div>

                   <Link href={`/product/${p.id}`} className="inline-block bg-accent-orange hover:bg-orange-600 text-white font-black text-lg px-12 py-4 rounded shadow-xl transition-all hover:-translate-y-1 uppercase tracking-widest">
                     Shop Now
                   </Link>
                </div>
                
                <div className="flex-1 hidden md:flex justify-end relative">
                   {p.imageUrl && (
                      <div className="relative group">
                         <div className="absolute -inset-4 bg-accent-orange/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                         <img src={p.imageUrl} alt={p.name} className="relative z-10 w-auto h-[350px] object-contain drop-shadow-2xl mix-blend-screen" />
                      </div>
                   )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
      
      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrent(prev => prev === 0 ? banners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur transition-all border border-white/10"
          >
             <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrent(prev => prev === banners.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur transition-all border border-white/10"
          >
             <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrent(i)}
                 className={`w-3 h-3 rounded-full transition-all border border-white/20 ${i === current ? 'bg-accent-orange w-8' : 'bg-white/50 hover:bg-white'}`}
               />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
