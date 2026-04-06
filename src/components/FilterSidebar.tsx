"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
     setCategory(searchParams.get("category") || "");
     setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-200 sticky top-24">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-900 pb-2 inline-block">Filters & Sort</h3>
      
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Category</label>
        <div className="space-y-2">
          {["", "Junction Box", "D.B. Pole Box", "Modular Box"].map(cat => (
             <label key={cat} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-accent-orange transition-colors">
               <input 
                 type="radio" 
                 name="category" 
                 checked={category === cat}
                 onChange={() => updateFilters('category', cat)}
                 className="text-accent-orange focus:ring-accent-orange"
               />
               {cat || "All Categories"}
             </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sort By</label>
        <select 
           value={sort}
           onChange={(e) => updateFilters('sort', e.target.value)}
           className="w-full bg-slate-50 border border-slate-300 text-sm rounded p-2 focus:ring-1 focus:ring-accent-orange outline-none"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      
      <button 
        onClick={() => router.push('/search')}
        className="w-full text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
