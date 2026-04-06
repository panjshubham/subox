import { prisma } from "@/lib/prisma";
import { BannerSlider } from "@/components/BannerSlider";
import { ShopInterface } from "@/components/ShopInterface";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";


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
         <HeroSection />
      )}

      <StatsBar />

      {/* Shop Region */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ShopInterface products={products} />
      </div>
    </div>
  );
}
