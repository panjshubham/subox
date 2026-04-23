import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const VALID_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true, items: true },
    });

    // Trigger email notification (non-blocking)
    if (updatedOrder.user?.email) {
      const { sendShippingUpdateEmail, sendDeliveryUpdateEmail } = await import('@/lib/email');
      if (status === 'SHIPPED') {
        sendShippingUpdateEmail(updatedOrder, updatedOrder.user).catch(e =>
          console.error('Shipping email error', e)
        );
      } else if (status === 'DELIVERED') {
        sendDeliveryUpdateEmail(updatedOrder, updatedOrder.user).catch(e =>
          console.error('Delivery email error', e)
        );
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
