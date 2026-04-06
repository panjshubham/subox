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
    if (status === 'SHIPPED' && updatedOrder.user?.email) {
       const { sendShippingUpdateEmail } = await import('@/lib/email');
       sendShippingUpdateEmail(updatedOrder, updatedOrder.user).catch(e => console.error("Shipping email error", e));
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Failed to update order status", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
