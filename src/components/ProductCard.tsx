import Link from "next/link";
import { Package, ShieldCheck, CheckCircle2, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

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
    alert(`Added ${product.name} to cart!`);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const featureList = product.features.split(',').map(f => f.trim()).slice(0, 3); // take first 3

  return (
    <div className={`bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full group relative ${!product.inStock && 'opacity-70 grayscale-[0.5]'}`}>
      
      {/* Rust Resistant Badge / Out of Stock Badge */}
       <div className={`absolute top-4 left-4 z-10 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded shadow-sm border uppercase tracking-wide ${product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {product.inStock ? <><ShieldCheck className="w-3 h-3" /> Rust Resistant</> : 'Out of Stock'}
       </div>

      <Link href={`/product/${product.id}`} className="block flex-1">
        <div className="bg-slate-50 w-full aspect-square flex items-center justify-center p-8 group-hover:bg-slate-100 transition-colors border-b border-slate-100 relative overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded mix-blend-multiply" />
          ) : (
            <Package className="w-32 h-32 text-slate-300 drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
          )}
        </div>

        <div className="p-5 flex flex-col h-full">
           <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
             {product.material} • {product.moduleSize}
           </div>
           
           <h3 className="text-lg font-black text-slate-800 leading-tight mb-4 group-hover:text-accent-orange transition-colors">
             {product.name}
           </h3>

           <ul className="text-xs text-slate-600 space-y-2 font-medium mb-6 flex-1">
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
             <div className="text-2xl font-black text-slate-900 tracking-tight">
               ₹{product.price.toFixed(2)} <span className="text-sm font-normal text-slate-500 tracking-normal">/ unit</span>
             </div>
             {product.inStock && (
                <div className="text-[10px] uppercase font-bold text-green-700 tracking-widest mt-1">
                   Buy 100+ for {product.bulkDiscount}% bulk off
                </div>
             )}
           </div>
        </div>
      </Link>

      <div className="p-5 pt-0 mt-auto">
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full font-bold py-3 rounded-md flex justify-center items-center gap-2 transition-colors uppercase tracking-widest text-sm shadow border hover:-translate-y-0.5 ${product.inStock ? 'bg-accent-orange hover:bg-accent-orange-hover text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
