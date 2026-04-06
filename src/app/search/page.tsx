import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  let whereClause: any = {};
  if (q) {
     whereClause.name = { contains: q, mode: 'insensitive' };
  }
  if (category) {
     whereClause.category = category;
  }

  const products = await prisma.product.findMany({
     where: whereClause,
     orderBy,
     include: {
        reviews: true
     }
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
           <FilterSidebar />
        </div>

        {/* Results */}
        <div className="flex-1">
           <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide mb-2">
             {q ? `Search Results for "${q}"` : "Industrial Catalog"}
           </h1>
           <p className="text-slate-500 font-medium mb-8">
             Found {products.length} {products.length === 1 ? 'item' : 'items'} matching your criteria.
           </p>

           {products.length === 0 ? (
             <div className="bg-white p-12 text-center rounded-xl shadow border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.map((product: any) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
