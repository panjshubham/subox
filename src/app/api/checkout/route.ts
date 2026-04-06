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
      },
      include: { user: true }
    });

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #f97316;">Order Confirmed!</h2>
        <p>Thank you for choosing ShuBox. Your order #INV-${order.id.toString().padStart(6,'0')} has been received and is currently PENDING.</p>
        <p>Please check your dashboard for updates regarding tracking and bank transfer execution.</p>
      </div>
    `;
    const { sendEmail } = await import('@/lib/email');
    if (order.user?.email) {
       await sendEmail(order.user.email, `Order #INV-${order.id.toString().padStart(6,'0')} Confirmed`, emailHtml);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
