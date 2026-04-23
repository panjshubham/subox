import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [orders, products] = await Promise.all([
      prisma.order.findMany({
        include: { items: true, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany(),
    ]);

    // Gross Revenue — totalAmount already includes GST at time of order
    const grossRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Total estimated stock market value (100 units per in-stock product)
    const stockValue = products
      .filter(p => p.inStock)
      .reduce((acc, p) => acc + p.price * 100, 0);

    const recentOrders = orders.slice(0, 10).map(o => ({
      id: o.id,
      date: o.createdAt,
      customer: o.user.companyName || o.user.fullName,
      total: o.totalAmount,
      status: o.status,
    }));

    return NextResponse.json({
      grossRevenue,
      totalOrders: orders.length,
      stockValue,
      recentOrders,
    });
  } catch (error: any) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
