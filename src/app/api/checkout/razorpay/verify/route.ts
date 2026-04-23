import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // Auth guard — prevent unauthenticated signature-verification attempts
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Signature verified — update the order status and persist the payment ID
    const order = await prisma.order.update({
      where: { id: Number(order_id) },
      data: {
        status: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id,
      },
      include: { user: true },
    });

    // Send payment-received email (non-blocking)
    if (order.user?.email) {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #f97316;">Razorpay Payment Received!</h2>
          <p>Thank you for choosing ShuBox. Your order <strong>#INV-${order.id
            .toString()
            .padStart(6, '0')}</strong> has been marked as PROCESSING.</p>
          <p>Your Razorpay Auth ID is: <code>${razorpay_payment_id}</code></p>
          <p>We will notify you once it ships.</p>
        </div>
      `;
      const { sendEmail } = await import('@/lib/email');
      sendEmail(
        order.user.email,
        `Payment Received - Order #INV-${order.id.toString().padStart(6, '0')}`,
        emailHtml
      ).catch(e => console.error('Payment confirmation email error:', e));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
