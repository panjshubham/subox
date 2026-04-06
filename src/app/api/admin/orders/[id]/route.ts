import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== '9830234950') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    const { id } = await params;
    const orderId = parseInt(id);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true, items: true }
    });

    // Trigger email capability 
    if (updatedOrder.user?.email) {
       const { sendShippingUpdateEmail, sendDeliveryUpdateEmail } = await import('@/lib/email');
       if (status === 'SHIPPED') {
          sendShippingUpdateEmail(updatedOrder, updatedOrder.user).catch(e => console.error("Shipping email error", e));
       } else if (status === 'DELIVERED') {
          sendDeliveryUpdateEmail(updatedOrder, updatedOrder.user).catch(e => console.error("Delivery email error", e));
       }
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Failed to update order status", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
