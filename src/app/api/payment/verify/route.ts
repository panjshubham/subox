import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount
    } = await req.json();

    // Validate required Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing Razorpay payment fields' }, { status: 400 });
    }

    // Verify HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    // FIX: was incorrectly using item.sizeId / item.sizeName — now uses item.id / item.name
    const newOrder = await prisma.order.create({
      data: {
        userId: session.userId,
        totalAmount,
        paymentMode: 'RAZORPAY',
        status: 'PENDING',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { user: true, items: true },
    });

    // Send confirmation emails (non-blocking)
    if (newOrder.user?.email) {
      const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } = await import('@/lib/email');
      sendOrderConfirmationEmail(newOrder, newOrder.user).catch(e =>
        console.error('Order email error', e)
      );
      sendAdminNewOrderEmail(newOrder, newOrder.user).catch(e =>
        console.error('Admin email error', e)
      );
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
