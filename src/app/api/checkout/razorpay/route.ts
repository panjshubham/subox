import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate Razorpay env vars at request time — not module initialisation
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }

    // NOTE: totalAmount sent from the client should already be the final amount
    // (the cart page adds GST before calling this endpoint).
    // We do NOT apply GST again here to avoid double-charging.
    const finalTotal = totalAmount;

    // Create the DB order first so we have an ID for the Razorpay receipt
    const newOrder = await prisma.order.create({
      data: {
        userId: session.userId,
        totalAmount: finalTotal,
        paymentMode: 'RAZORPAY',
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price * item.quantity,
          })),
        },
      },
    });

    // Initialise Razorpay per-request (safe for serverless/Edge environments)
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100), // paise
      currency: 'INR',
      receipt: `receipt_order_${newOrder.id}`,
    });

    // Persist the Razorpay order ID back to the DB row
    await prisma.order.update({
      where: { id: newOrder.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
