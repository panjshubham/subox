import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await request.json();
    const { items, totalAmount, paymentMode } = json;

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        totalAmount,
        paymentMode: paymentMode || "BANK_TRANSFER",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
