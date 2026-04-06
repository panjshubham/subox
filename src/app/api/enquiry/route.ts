import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, company, phone, product, quantity, message } = await req.json();

    const textPayload = `
      New Bulk Enquiry from ${name} (${company})!
      
      Phone: ${phone}
      Product: ${product}
      Quantity: ${quantity}
      
      Message:
      ${message}
    `;

    const htmlPayload = `
      <h2>New Bulk Enquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Requested Product:</strong> ${product}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    const settings = await prisma.storeSettings.findFirst();
    const adminEmail = settings?.email || process.env.SMTP_USER || 'admin@example.com';

    await sendEmail(
       adminEmail, 
       `Bulk Enquiry: ${product} from ${company || name}`, 
       htmlPayload
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}
