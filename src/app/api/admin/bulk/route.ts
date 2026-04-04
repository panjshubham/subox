import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
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
       // Prisma sqlite does not support native field addition expressions well in updateMany (e.g. mrp: { increment: X })
       // So we fetch and iterate to be safe and cross-platform
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

    return NextResponse.json({ success: true, count: result?.count || 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Bulk apply failed' }, { status: 500 });
  }
}
