import { prisma } from "@/lib/prisma";
import { BannerSlider } from "@/components/BannerSlider";
import { ShopInterface } from "@/components/ShopInterface";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { price: 'asc' }
  });

  const bannerProducts = products.filter((p: any) => p.showInBanner);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Marketing Banners */}
      {bannerProducts.length > 0 ? (
         <BannerSlider banners={bannerProducts} />
      ) : (
        <div className="bg-slate-900 border-b-4 border-accent-orange text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-900 to-black pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="text-accent-orange font-black tracking-widest uppercase text-xs mb-4 inline-block bg-accent-orange/10 px-3 py-1 rounded border border-accent-orange/20">
              Professional Grade Series
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
              Engineered To Last. <br className="hidden md:block"/>
              <span className="text-slate-400">Built For Industry.</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl font-medium">
              Explore our high-grade G.I. and M.S. Modular Boxes. Weldless fabrication and rust-resistant coatings ensure unparalleled safety and durability for heavy-duty electrical installations.
            </p>
          </div>
        </div>
      )}
      
      {/* Shop Region */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ShopInterface products={products} />
      </div>
    </div>
  );
}
