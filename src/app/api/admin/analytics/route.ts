import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' }
    });

    const products = await prisma.product.findMany();

    // Gross Revenue (all orders combined)
    const grossRevenue = orders.reduce((acc, order) => {
       const cgst = order.totalAmount * 0.09;
       const sgst = order.totalAmount * 0.09;
       return acc + order.totalAmount + cgst + sgst;
    }, 0);

    // Total Stock Market Value
    let stockValue = 0;
    products.forEach(p => {
       if(p.inStock) {
          // Assume 100 units average stock if not tracked explicitly in the DB
          stockValue += p.price * 100; 
       }
    });

    const recentOrders = orders.slice(0, 10).map(o => ({
       id: o.id,
       date: o.createdAt,
       customer: o.user.companyName || o.user.fullName,
       total: o.totalAmount + (o.totalAmount * 0.18),
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
