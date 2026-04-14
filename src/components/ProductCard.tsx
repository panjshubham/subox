"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Package, ShieldCheck, CheckCircle2, ShoppingCart, Star } from "lucide-react";
import { useCart } from "./CartProvider";
import toast from "react-hot-toast";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    mrp: number;
    price: number;
    moduleSize: string;
    material: string;
    inStock: boolean;
    bulkDiscount: number;
    features: string;
    imageUrl: string | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem({
      id: `${product.id}-${Date.now()}`,
      sizeId: product.id,
      sizeName: product.name,
      price: product.price,
      quantity: 1,
      bulkDiscount: product.bulkDiscount
    });
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      style: { fontWeight: "bold", fontSize: "13px" },
    });
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const featureList = product.features.split(',').map(f => f.trim()).slice(0, 3); // take first 3

  return (
    <div className={`bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative ${!product.inStock && 'opacity-70 grayscale-[0.5]'}`}>
      
      {/* Rust Resistant Badge / Out of Stock Badge */}
       <div className={`absolute top-4 left-4 z-10 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded shadow-sm border uppercase tracking-wide ${product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {product.inStock ? <><ShieldCheck className="w-3 h-3" /> Rust Resistant</> : 'Out of Stock'}
       </div>

      <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
        <div className="bg-slate-50 w-full aspect-square flex items-center justify-center p-8 group-hover:bg-slate-100 transition-colors border-b border-slate-100 relative overflow-hidden shrink-0">
          {product.imageUrl ? (
            <>
               <div className={`absolute inset-0 bg-slate-200 animate-pulse z-0 ${!isImageLoading && 'hidden'}`} />
               <Image 
                 src={product.imageUrl} 
                 alt={product.name} 
                 fill
                 onLoad={() => setIsImageLoading(false)}
                 className={`object-cover group-hover:scale-105 transition-all duration-500 rounded mix-blend-multiply z-10 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
               />
            </>
          ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-center rounded border border-slate-200 border-dashed group-hover:scale-105 transition-transform duration-300">
               <div className="w-16 h-16 bg-accent-orange text-white rounded flex items-center justify-center font-black text-3xl tracking-wider shadow-sm mb-3">
                 SB
               </div>
               <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Industrial<br/>Enclosure</span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
           <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
             <span>{product.material} • {product.moduleSize}</span>
             {(product as any).reviews?.length > 0 && (
                <span className="flex items-center gap-1 text-accent-orange font-black">
                   <Star className="w-3 h-3 fill-current" />
                   {((product as any).reviews.reduce((a:number, r:any)=>a+r.rating,0)/(product as any).reviews.length).toFixed(1)}
                </span>
             )}
           </div>
           
           <h3 className="text-lg font-black text-slate-800 leading-tight mb-4 group-hover:text-accent-orange transition-colors">
             {product.name}
           </h3>

           <ul className="text-xs text-slate-600 space-y-2 font-medium mb-6">
             {featureList.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                 <CheckCircle2 className="w-4 h-4 text-accent-orange shrink-0" />
                 {feature}
                </li>
             ))}
           </ul>

           <div className="pt-4 border-t border-slate-100 flex flex-col items-start mt-auto">
             <div className="flex items-center gap-2 mb-1">
               <span className="text-slate-400 font-medium line-through text-sm">₹{product.mrp.toFixed(2)}</span>
               <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">
                 {discountPercent}% OFF
               </span>
             </div>
             <div className="text-2xl font-black text-slate-900 tracking-tight visible">
               ₹{product.price.toFixed(2)} <span className="text-sm font-normal text-slate-500 tracking-normal">/ unit</span>
             </div>
             {product.inStock ? (
                <div className="text-[10px] uppercase font-bold text-green-700 tracking-widest mt-1">
                   Buy 100+ for {product.bulkDiscount}% bulk off
                </div>
             ) : (
                <div className="text-[10px] uppercase font-bold text-red-500 tracking-widest mt-1">
                   Currently Unavailable
                </div>
             )}
           </div>
        </div>
      </Link>

      <div className="p-5 pt-0 mt-auto shrink-0 w-full">
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          whileTap={product.inStock ? { scale: 0.97 } : {}}
          transition={{ duration: 0.1 }}
          className={`w-full font-bold py-3 rounded-md flex justify-center items-center gap-2 transition-colors uppercase tracking-widest text-sm shadow border ${product.inStock ? 'bg-accent-orange hover:bg-accent-orange-hover text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </motion.button>
      </div>
    </div>
  );
}
