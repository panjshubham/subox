import { prisma } from "@/lib/prisma";
import { BannerSlider } from "@/components/BannerSlider";
import { ShopInterface } from "@/components/ShopInterface";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { Package2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { price: 'asc' }
  });

  console.log("HOMEPAGE FETCHED PRODUCTS:", products.length);

  const bannerProducts = products.filter((p: any) => p.showInBanner);

  return (
    <div className="bg-slate-50 min-h-screen">
      {bannerProducts.length > 0 ? (
        <BannerSlider banners={bannerProducts} />
      ) : (
        <HeroSection />
      )}

      <StatsBar />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-dashed border-slate-300 flex items-center justify-center mb-6">
              <Package2 className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest mb-3">Catalog Coming Soon</h2>
            <p className="text-slate-500 font-medium max-w-md leading-relaxed mb-8">
              Our product catalog is being set up. Run <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">npm run db:seed</code> to instantly populate with real products, or add them via the Admin Panel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange-hover text-white font-black uppercase tracking-widest px-8 py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
              >
                Go to Admin Panel <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 border-2 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-800 font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        ) : (
          <ShopInterface products={products} />
        )}
      </div>
    </div>
  );
}

