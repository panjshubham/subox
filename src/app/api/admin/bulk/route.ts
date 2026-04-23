import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, type, value } = await request.json();

    if (!category || !type || value === undefined) {
      return NextResponse.json({ error: 'Missing required parameters: category, type, value' }, { status: 400 });
    }

    const VALID_TYPES = ['FLAT_DISCOUNT', 'ADD_MRP'];
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return NextResponse.json({ error: 'value must be a number' }, { status: 400 });
    }

    let count = 0;

    if (type === 'FLAT_DISCOUNT') {
      const result = await prisma.product.updateMany({
        where: { category },
        data: { bulkDiscount: numericValue },
      });
      count = result.count;
    } else if (type === 'ADD_MRP') {
      // updateMany doesn't support field-relative increments in all adapters, so we loop
      const products = await prisma.product.findMany({ where: { category } });
      for (const p of products) {
        await prisma.product.update({
          where: { id: p.id },
          data: { mrp: p.mrp + numericValue },
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Bulk apply failed:', error);
    return NextResponse.json({ error: 'Bulk apply failed' }, { status: 500 });
  }
}
