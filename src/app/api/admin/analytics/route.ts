import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  // Admin-only route
  const session = await getSession();
  if (!session || session.mobile !== '9830234950') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' }
    });

    const products = await prisma.product.findMany();

    // Gross Revenue — totalAmount stored in DB already includes GST at time of order,
    // so we use it directly without multiplying again.
    const grossRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Total Stock Market Value (estimated at 100 units average per in-stock product)
    let stockValue = 0;
    products.forEach(p => {
       if (p.inStock) {
          stockValue += p.price * 100;
       }
    });

    const recentOrders = orders.slice(0, 10).map(o => ({
       id: o.id,
       date: o.createdAt,
       customer: o.user.companyName || o.user.fullName,
       total: o.totalAmount,
       status: o.status
    }));

    return NextResponse.json({
       grossRevenue,
       totalOrders: orders.length,
       stockValue,
       recentOrders
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
