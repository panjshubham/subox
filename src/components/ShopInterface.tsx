"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";

// ─── Types ───────────────────────────────────

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

type FilterPanelProps = {
  modules: string[];
  materials: string[];
  selectedModules: string[];
  selectedMaterials: string[];
  onModuleToggle: (m: string) => void;
  onMaterialToggle: (m: string) => void;
};

// ─── Shared filter panel (desktop + inside mobile drawer) ────────────────────

function FilterPanel({
  modules, materials, selectedModules, selectedMaterials,
  onModuleToggle, onMaterialToggle,
}: FilterPanelProps) {
  return (
    <div>
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-accent-orange pb-2 inline-block">
        Filters
      </h2>

      <div className="mb-8">
        <h3 className="font-bold text-slate-800 mb-4 uppercase text-sm">Module Size</h3>
        <div className="space-y-3">
          {modules.map(mod => (
            <label key={mod} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-accent-orange focus:ring-accent-orange"
                checked={selectedModules.includes(mod)}
                onChange={() => onModuleToggle(mod)}
              />
              <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                {mod} ({mod.replace("M", "")} Module)
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-4 uppercase text-sm">Material Type</h3>
        <div className="space-y-3">
          {materials.map(mat => (
            <label key={mat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-accent-orange focus:ring-accent-orange"
                checked={selectedMaterials.includes(mat)}
                onChange={() => onMaterialToggle(mat)}
              />
              <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors uppercase">
                {mat}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile animated drawer ──────────────────

type DrawerProps = FilterPanelProps & {
  activeCount: number;
  productCount: number;
  onClear: () => void;
};

function MobileFilterDrawer({
  activeCount, productCount,
  modules, materials, selectedModules, selectedMaterials,
  onModuleToggle, onMaterialToggle, onClear,
}: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button row */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded border border-slate-200 shadow-sm mb-4">
        <span className="text-slate-600 font-medium text-sm">
          <strong className="text-slate-900">{productCount}</strong> products
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded font-black uppercase tracking-widest text-[10px] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-orange text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer slides in from left */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b-4 border-accent-orange bg-slate-900 shrink-0">
                <div>
                  <h2 className="text-white font-black uppercase tracking-widest text-sm">Filters</h2>
                  {activeCount > 0 && (
                    <p className="text-accent-orange text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      {activeCount} active
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6">
                <FilterPanel
                  modules={modules}
                  materials={materials}
                  selectedModules={selectedModules}
                  selectedMaterials={selectedMaterials}
                  onModuleToggle={onModuleToggle}
                  onMaterialToggle={onMaterialToggle}
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
                {activeCount > 0 && (
                  <button
                    onClick={onClear}
                    className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded hover:border-slate-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded hover:bg-slate-800 transition-colors"
                >
                  Show {productCount} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main ShopInterface ──────────────────────

export function ShopInterface({ products }: { products: Product[] }) {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const handleModuleToggle = (module: string) =>
    setSelectedModules(prev =>
      prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
    );

  const handleMaterialToggle = (material: string) =>
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );

  const filteredProducts = products.filter(p => {
    const moduleMatch = selectedModules.length === 0 || selectedModules.includes(p.moduleSize);
    const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(p.material);
    return moduleMatch && materialMatch;
  });

  const uniqueModules = Array.from(new Set(products.map(p => p.moduleSize))).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const uniqueMaterials = Array.from(new Set(products.map(p => p.material))).sort();
  const activeFilterCount = selectedModules.length + selectedMaterials.length;

  const filterProps: FilterPanelProps = {
    modules: uniqueModules,
    materials: uniqueMaterials,
    selectedModules,
    selectedMaterials,
    onModuleToggle: handleModuleToggle,
    onMaterialToggle: handleMaterialToggle,
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">

      {/* Mobile drawer toggle — hidden on desktop */}
      <div className="md:hidden">
        <MobileFilterDrawer
          {...filterProps}
          activeCount={activeFilterCount}
          productCount={filteredProducts.length}
          onClear={() => { setSelectedModules([]); setSelectedMaterials([]); }}
        />
      </div>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-28">
          <FilterPanel {...filterProps} />
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm">
          <span className="text-slate-600 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSelectedModules([]); setSelectedMaterials([]); }}
              className="text-xs font-black text-accent-orange uppercase tracking-widest hover:underline"
            >
              Clear ({activeFilterCount})
            </button>
          )}
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
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: (index % 6) * 0.1,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
