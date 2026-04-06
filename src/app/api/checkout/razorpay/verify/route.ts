import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Signature verified
    const order = await prisma.order.update({
      where: { id: Number(order_id) },
      data: {
        status: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id
      },
      include: { user: true }
    });

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #f97316;">Razorpay Payment Received!</h2>
        <p>Thank you for choosing ShuBox. Your order #INV-${order.id.toString().padStart(6,'0')} has been marked as PROCESSING.</p>
        <p>Your Razorpay Auth ID is: ${razorpay_payment_id}</p>
        <p>We will notify you once it ships.</p>
      </div>
    `;
    const { sendEmail } = await import('@/lib/email');
    if (order.user.email) {
       await sendEmail(order.user.email, `Payment Received - Order #INV-${order.id.toString().padStart(6,'0')}`, emailHtml);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
