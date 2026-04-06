import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Taxes
    const cgst = totalAmount * 0.09;
    const sgst = totalAmount * 0.09;
    const finalTotal = totalAmount + cgst + sgst;

    // Create Database Order First
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
             price: item.price * item.quantity
          }))
        }
      }
    });

    // Create Razorpay Gateway Order
    const options = {
      amount: Math.round(finalTotal * 100), // Razorpay takes amount in paise
      currency: "INR",
      receipt: `receipt_order_${newOrder.id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save mapping
    await prisma.order.update({
       where: { id: newOrder.id },
       data: { razorpayOrderId: razorpayOrder.id }
    });

    return NextResponse.json({
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || 'dummy_key_id'
    });

  } catch (error: any) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
