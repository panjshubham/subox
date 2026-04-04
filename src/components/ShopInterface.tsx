"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";

type Product = {
  id: number;
  name: string;
  moduleSize: string;
  material: string;
  mrp: number;
  price: number;
  dimensions: string;
  inStock: boolean;
  bulkDiscount: number;
  features: string;
  imageUrl: string | null;
};

type ShopInterfaceProps = {
  products: Product[];
};

export function ShopInterface({ products }: ShopInterfaceProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const handleModuleToggle = (module: string) => {
    setSelectedModules((prev) => 
      prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
    );
  };

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev) => 
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const filteredProducts = products.filter(p => {
    const moduleMatch = selectedModules.length === 0 || selectedModules.includes(p.moduleSize);
    const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(p.material);
    return moduleMatch && materialMatch;
  });

  const uniqueModules = Array.from(new Set(products.map(p => p.moduleSize))).sort((a, b) => parseInt(a) - parseInt(b));
  const uniqueMaterials = Array.from(new Set(products.map(p => p.material))).sort();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filter Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-28">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-accent-orange pb-2 inline-block">
            Filters
          </h2>

          <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-4 uppercase text-sm">Module Size</h3>
            <div className="space-y-3">
              {uniqueModules.map(mod => (
                <label key={mod} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-accent-orange focus:ring-accent-orange"
                    checked={selectedModules.includes(mod)}
                    onChange={() => handleModuleToggle(mod)}
                  />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{mod} ({mod.replace('M', '')} Module)</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-4 uppercase text-sm">Material Type</h3>
            <div className="space-y-3">
              {uniqueMaterials.map(mat => (
                <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-accent-orange focus:ring-accent-orange"
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => handleMaterialToggle(mat)}
                  />
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors uppercase">{mat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm">
           <span className="text-slate-600 font-medium">
             Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
           </span>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your filters.</p>
            <button 
              onClick={() => { setSelectedModules([]); setSelectedMaterials([]); }}
              className="mt-4 text-accent-orange font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
