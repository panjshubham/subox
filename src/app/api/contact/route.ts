import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, phone, company, message } = await req.json();

    const htmlPayload = `
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f97316; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-weight: 900; letter-spacing: 2px;">SHUBOX CONTACT</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Site Message Received</h2>
          <p style="margin-bottom: 20px; color: #64748b;">A visitor has sent a message from the Shobox Contact Page.</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Company:</td>
              <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${company || 'N/A'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 4px; border-left: 4px solid #f97316;">
            <p style="margin: 0; font-weight: bold; color: #0f172a; margin-bottom: 5px;">Message Details:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #334155;">${message}</p>
          </div>
        </div>
      </div>
    `;

    const settings = await prisma.storeSettings.findFirst();
    const adminEmail = settings?.email || process.env.SMTP_USER || 'admin@example.com';

    await sendEmail(
       adminEmail, 
       `Site Message: From ${name} (${company || 'Direct'})`, 
       htmlPayload
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
