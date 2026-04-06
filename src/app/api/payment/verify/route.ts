import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, totalAmount } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    // Since FIX 2 hasn't run yet, we will use the existing schema structure for Order or dummy it gently.
    // Assuming Order already takes userId, totalAmount.
    // Wait, the new schema proposed in FIX 2 requires "total" and "status". Let's use the current schema `totalAmount`, etc. and adapt it for now to avoid crashing Prisma.
    // User requested "Create Order in DB with status Pending", we will just stick to the current DB schema until Fix 2 migration is done.
    
    const newOrder = await prisma.order.create({
      data: {
         userId: session.userId,
         totalAmount,
         paymentMode: "RAZORPAY",
         status: "PENDING", 
         razorpayOrderId: razorpay_order_id,
         razorpayPaymentId: razorpay_payment_id,
         items: {
           create: items.map((item: any) => ({
             productId: item.sizeId, // maps to existing
             productName: item.sizeName,
             quantity: item.quantity,
             price: item.price
           }))
         }
      },
      include: { user: true }
    });

    // Send confirmation emails
    if (newOrder.user?.email) {
      const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } = await import('@/lib/email');
      
      // Async background emails so we don't hold up the API
      sendOrderConfirmationEmail(newOrder, newOrder.user).catch(e => console.error("Order email error", e));
      sendAdminNewOrderEmail(newOrder, newOrder.user).catch(e => console.error("Admin email error", e));
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
