import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Package, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { ProductReviewManager } from "@/components/ProductReviewManager";
import { ProductActions } from "@/components/ProductActions";
import { getSession } from "@/lib/auth";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Product Not Found - ShuBox' };
  return {
    title: `${product.name} | ShuBox Industrial`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ₹${product.price} (Bulk Discounts Available)`,
      description: `Premium ${product.material} ${product.category}. ${product.features}. Factory direct from ShuBox Kolkata.`,
      images: product.imageUrl ? [product.imageUrl] : [],
    }
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const [product, settings, session] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { fullName: true, companyName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.storeSettings.findFirst(),
    getSession()
  ]);

  if (!product) return notFound();

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const featureList = product.features.split(',').map((f: string) => f.trim());
  const waNumber = settings?.phoneOne ? settings.phoneOne.replace(/\D/g, '') : "919830234950";
  const waMessage = `Hi ${settings?.brandName || 'ShuBox'}! I am interested in ordering the ${product.name} in bulk. Please provide the best B2B rate.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl ? [product.imageUrl] : [],
    "description": product.description,
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": settings?.businessName || "Shubham Enterprise" }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-accent-orange transition-colors uppercase">Store</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-bold uppercase">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* ── Image Section ── */}
            <div className={`w-full lg:w-1/2 bg-slate-100 flex items-center justify-center p-8 lg:p-16 relative border-r border-slate-200 overflow-hidden ${!product.inStock && 'grayscale-[0.5] opacity-80'}`}>
              <div className={`absolute top-6 left-6 z-10 flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded shadow-sm border uppercase tracking-wide ${product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {product.inStock ? <><ShieldCheck className="w-4 h-4" /> Rust Resistant</> : <><AlertTriangle className="w-4 h-4" /> Out of Stock</>}
              </div>
              {product.imageUrl ? (
                <div className="w-full flex flex-col items-center">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain max-h-[400px] drop-shadow-xl mix-blend-multiply" />
                  {product.imageGallery && (
                    <div className="flex gap-2 w-full overflow-x-auto p-4 border-t border-slate-200 mt-4">
                      {JSON.parse(product.imageGallery).map((url: string, i: number) => (
                        <img key={i} src={url} className="w-20 h-20 object-cover rounded border border-slate-300 shadow-sm mix-blend-multiply bg-white" alt="Gallery item" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Package className="w-64 h-64 text-slate-300 drop-shadow-md" />
              )}
            </div>

            {/* ── Details Section ── */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
              <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">
                {product.material} • {product.moduleSize} • {product.dimensions}" • {product.primaryUse}
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-medium line-through text-lg">MRP: ₹{product.mrp.toFixed(2)}</span>
                  <div className="text-4xl font-black text-slate-900 tracking-tight">
                    ₹{product.price.toFixed(2)} <span className="text-base font-normal text-slate-500">/ unit</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {product.inStock && (
                      <div className="text-xs uppercase font-bold text-green-700 tracking-widest bg-green-50 px-2 py-1 rounded border border-green-200">
                        Bulk: {product.bulkDiscount}% off at 100+ units
                      </div>
                    )}
                    {product.reviews.length > 0 && (
                      <Link href="#reviews" className="flex items-center gap-1.5 text-xs font-black text-accent-orange bg-orange-50 px-2 py-1 rounded border border-orange-200 hover:bg-orange-100 transition-colors uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-current" />
                        {(product.reviews.reduce((a: number, r: any) => a + r.rating, 0) / product.reviews.length).toFixed(1)} ({product.reviews.length} Review{product.reviews.length > 1 && 's'})
                      </Link>
                    )}
                  </div>
                </div>
                <div className="bg-red-600 font-extrabold text-white px-6 py-2 rounded-lg shadow-xl uppercase tracking-widest text-2xl ml-auto self-start border border-red-500">
                  {discountPercent}% OFF
                </div>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed italic border-l-4 border-slate-300 pl-4">
                {product.description}
              </p>

              <ul className="text-slate-700 space-y-3 font-medium mb-6">
                {featureList.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="bg-accent-orange/10 p-2 rounded-full shrink-0"><CheckCircle2 className="w-5 h-5 text-accent-orange" /></div>
                    {f}
                  </li>
                ))}
              </ul>

              <DeliveryChecker />

              {/* Quantity selector + Add to Cart + Bulk Quote Modal */}
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  inStock: product.inStock,
                  bulkDiscount: product.bulkDiscount,
                  material: product.material,
                  moduleSize: product.moduleSize,
                }}
              />

              <div className="mt-4">
                <Link
                  href={waLink}
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-500/20 transition-colors uppercase tracking-widest text-sm w-full"
                >
                  Chat on WhatsApp for Factory Rates
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest mb-6 border-b-4 border-accent-orange pb-2 inline-block">
            Technical Specifications
          </h2>
          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden max-w-4xl">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-200">
                {[
                  ["Material Thickness", product.thickness],
                  ["Dimensions", `${product.dimensions} Inches`],
                  ["Module Capacity", product.moduleSize],
                  ["Base Material", product.material === "G.I." ? "Galvanized Iron (G.I.)" : "Mild Steel (M.S.)"],
                  ["HSN Code", product.hsnCode],
                  ["Coating Type", product.coating],
                ].map(([label, value]) => (
                  <tr key={label} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 bg-slate-100 font-bold text-slate-700 w-1/3 border-r border-slate-200 uppercase tracking-widest text-xs">{label}</td>
                    <td className="p-4 text-slate-600 font-bold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-12">
          <ProductReviewManager
            productId={product.id}
            initialReviews={product.reviews}
            sessionUser={session}
          />
        </div>
      </div>
    </div>
  );
}
