import nodemailer from 'nodemailer';

const BRAND_ORANGE = '#F97316';
const BRAND_NAVY = '#0F172A';

const renderEmailLayout = (content: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: ${BRAND_NAVY}; padding: 30px; text-align: center; border-bottom: 4px solid ${BRAND_ORANGE};">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;">SHUBOX</h1>
      <p style="color: ${BRAND_ORANGE}; margin: 5px 0 0; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Industrial Grade Enclosures</p>
    </div>
    <div style="padding: 40px 30px; color: #334155; line-height: 1.6;">
      ${content}
    </div>
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
        Shubham Enterprise • Kolkata, India
      </p>
      <p style="margin: 5px 0 0; font-size: 10px; color: #cbd5e1;">
        41, Tangra Road, Kolkata - 700 015 | GSTIN: 19EAOPP6239Q1ZH
      </p>
    </div>
  </div>
`;

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER || '93.shubhampanjiyara@gmail.com',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || 'your_gmail_app_password'
      }
    });

    const mailOptions = {
      from: `"SHUBOX Industrial" <${process.env.SMTP_USER || process.env.EMAIL_USER || '93.shubhampanjiyara@gmail.com'}>`,
      to,
      subject,
      html: renderEmailLayout(html)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Industrial Email Sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('SMTP Transmission Error:', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async (order: any, customer: any) => {
  const content = `
    <h2 style="color: ${BRAND_NAVY}; margin-top: 0; font-weight: 800; text-transform: uppercase; font-size: 20px;">Order Received ✅</h2>
    <p>Hi <strong>${customer.fullName}</strong>,</p>
    <p>Thank you for choosing SHUBOX. Your industrial order <strong>#INV-${order.id.toString().padStart(6,'0')}</strong> is now in our system.</p>
    
    <div style="margin: 25px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">
          <th style="padding: 12px 15px;">Item Specification</th>
          <th style="padding: 12px 15px; text-align: center;">Qty</th>
          <th style="padding: 12px 15px; text-align: right;">Price</th>
        </tr>
        ${order.items?.map((i: any) => `
          <tr style="border-top: 1px solid #f1f5f9; font-size: 13px;">
            <td style="padding: 12px 15px; font-weight: bold; color: #1e293b;">${i.productName}</td>
            <td style="padding: 12px 15px; text-align: center;">${i.quantity}</td>
            <td style="padding: 12px 15px; text-align: right; font-family: monospace;">₹${i.price.toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr style="background-color: #f8fafc; border-top: 2px solid #e2e8f0; font-size: 14px;">
          <td colspan="2" style="padding: 15px; text-align: right; font-weight: 800; text-transform: uppercase;">Total Quote (Incl. GST)</td>
          <td style="padding: 15px; text-align: right; font-weight: 900; color: ${BRAND_ORANGE}; font-size: 18px;">₹${order.totalAmount?.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${order.paymentMode === 'BANK_TRANSFER' ? `
      <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; border-left: 4px solid ${BRAND_ORANGE}; margin-bottom: 25px;">
        <p style="margin: 0; font-size: 13px; color: #9a3412;"><strong>Action Required:</strong> Since you selected Bank Transfer, please complete the payment to initiate dispatch. You can find our bank details in the "Payment" section of your profile.</p>
      </div>
    ` : ''}

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://subox.vercel.app/profile" style="background-color: ${BRAND_NAVY}; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block;">Track Deployment Status</a>
    </div>
  `;
  return sendEmail(customer.email, `SHUBOX: Order Confirmation #INV-${order.id.toString().padStart(6,'0')}`, content);
};

export const sendShippingUpdateEmail = async (order: any, customer: any) => {
  const content = `
    <h2 style="color: ${BRAND_NAVY}; margin-top: 0; font-weight: 800; text-transform: uppercase; font-size: 20px;">Cargo Dispatched 🚚</h2>
    <p>Hi <strong>${customer.fullName}</strong>,</p>
    <p>Your industrial cargo for Order <strong>#INV-${order.id.toString().padStart(6,'0')}</strong> has left our facility in Kolkata and is now in transit.</p>
    
    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <p style="margin: 0 0 10px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Project Site Address:</p>
      <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b;">${customer.address || 'Contact Admin for Details'}</p>
      <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
      <p style="margin: 0; font-size: 13px; font-weight: 600; color: ${BRAND_ORANGE};">Estimated Arrival: 3-7 Business Days</p>
    </div>

    <p style="font-size: 13px; color: #64748b;">Please ensure that an authorized representative is present at the site with proper unloading equipment for bulk delivery.</p>
  `;
  return sendEmail(customer.email, `SHUBOX: Cargo Dispatched #INV-${order.id.toString().padStart(6,'0')}`, content);
};

export const sendDeliveryUpdateEmail = async (order: any, customer: any) => {
  const content = `
    <h2 style="color: #16a34a; margin-top: 0; font-weight: 800; text-transform: uppercase; font-size: 20px;">Deployment Complete ✅</h2>
    <p>Hi <strong>${customer.fullName}</strong>,</p>
    <p>Your Order <strong>#INV-${order.id.toString().padStart(6,'0')}</strong> has been successfully delivered and verified at the project site.</p>
    
    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 25px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; font-weight: bold; color: #166534;">We hope our industrial enclosures meet your project standards.</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://subox.vercel.app/product/${order.items?.[0]?.productId || '1'}" style="background-color: ${BRAND_ORANGE}; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block;">Leave a Project Certification</a>
    </div>
  `;
  return sendEmail(customer.email, `SHUBOX: Order Delivered #INV-${order.id.toString().padStart(6,'0')}`, content);
};

export const sendAdminNewOrderEmail = async (order: any, customer: any) => {
  const content = `
    <h2 style="color: ${BRAND_ORANGE}; margin-top: 0; font-weight: 900; text-transform: uppercase; font-size: 20px;">⚠️ NEW INDUSTRIAL ORDER</h2>
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 5px solid ${BRAND_NAVY};">
      <p><strong>Order ID:</strong> #INV-${order.id.toString().padStart(6,'0')}</p>
      <p><strong>Client:</strong> ${customer.fullName} (${customer.companyName || 'Indiv/Contractor'})</p>
      <p><strong>Mobile:</strong> ${customer.mobile}</p>
      <p><strong>Total value:</strong> ₹${order.totalAmount?.toFixed(2)}</p>
      <p><strong>Mode:</strong> ${order.paymentMode}</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
       <a href="https://subox.vercel.app/admin" style="color: ${BRAND_NAVY}; font-weight: bold; font-size: 12px;">LOGIN TO ADMIN PANEL &rarr;</a>
    </div>
  `;
  return sendEmail(process.env.EMAIL_USER || process.env.SMTP_USER || '93.shubhampanjiyara@gmail.com', `ADMIN: New Order INV-${order.id}`, content);
};
