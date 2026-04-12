import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  // Admin-only route
  const session = await getSession();
  if (!session || session.mobile !== '9830234950') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { category, type, value } = await request.json();

    if (!category || !type || value === undefined) {
      return NextResponse.json({ error: 'Missing logic parameters' }, { status: 400 });
    }

    let result;

    if (type === 'FLAT_DISCOUNT') {
      result = await prisma.product.updateMany({
        where: { category },
        data: { bulkDiscount: Number(value) }
      });
    } else if (type === 'ADD_MRP') {
       const numericValue = Number(value);
       // We fetch and loop because `prisma.product.updateMany` doesn't support
       // field-relative increments (e.g. mrp + X) in a single query across all Prisma adapters.
       const products = await prisma.product.findMany({ where: { category } });
       let count = 0;
       for (const p of products) {
          await prisma.product.update({
             where: { id: p.id },
             data: { mrp: p.mrp + numericValue }
          });
          count++;
       }
       result = { count };
    }

    return NextResponse.json({ success: true, count: (result as any)?.count || 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Bulk apply failed' }, { status: 500 });
  }
}
