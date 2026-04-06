import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'dummy@gmail.com',
        pass: process.env.SMTP_PASS || 'dummy_password'
      }
    });

    const mailOptions = {
      from: `"ShuBox B2B" <${process.env.SMTP_USER || 'dummy@gmail.com'}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async (order: any, customer: any) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f97316; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-weight: 900; letter-spacing: 2px;">SHUBOX</h1>
      </div>
      <div style="padding: 20px; color: #1e293b;">
        <h2>Your order has been placed!</h2>
        <p>Hi ${customer.fullName},</p>
        <p>Thank you for choosing SHUBOX Industrial Grade. Your Order <strong>#INV-${order.id.toString().padStart(6,'0')}</strong> is now being processed.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background:#f1f5f9; text-align:left;">
            <th style="padding: 8px;">Product</th>
            <th style="padding: 8px;">Qty</th>
            <th style="padding: 8px;">Price</th>
          </tr>
          ${order.items?.map((i:any) => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px;">${i.productName}</td>
              <td style="padding: 8px;">${i.quantity}</td>
              <td style="padding: 8px;">₹${i.price.toFixed(2)}</td>
            </tr>
          `).join('') || ''}
        </table>
        <h3>Total with GST: ₹${order.totalAmount?.toFixed(2)}</h3>
        ${order.paymentMode === 'BANK_TRANSFER' ? `
          <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 4px;">
            <strong>Bank Transfer Details Pending:</strong> Please transfer the total amount to complete processing. Check your profile for bank details.
          </div>
        ` : ''}
        <p><a href="https://shubox.local/profile" style="color: #f97316; font-weight: bold;">Track your order here &rarr;</a></p>
      </div>
    </div>
  `;
  return sendEmail(customer.email, `Order #INV-${order.id.toString().padStart(6,'0')} Confirmed`, html);
};

export const sendAdminNewOrderEmail = async (order: any, customer: any) => {
  const html = `
    <div style="font-family: sans-serif; color: #1e293b;">
      <h2 style="color: #f97316;">⚠️ New Order Alert</h2>
      <p><strong>Order ID:</strong> INV-${order.id.toString().padStart(6,'0')}</p>
      <p><strong>Customer:</strong> ${customer.fullName} (${customer.companyName || 'N/A'})</p>
      <p><strong>Phone:</strong> ${customer.mobile}</p>
      <p><strong>GST:</strong> ${customer.gstNumber || 'N/A'}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount?.toFixed(2)}</p>
      <p><strong>Dispatch Address:</strong> ${customer.address || 'N/A'}</p>
    </div>
  `;
  return sendEmail(process.env.EMAIL_USER || process.env.SMTP_USER || 'admin@shubox.com', `New Order Alert: INV-${order.id}`, html);
};

export const sendShippingUpdateEmail = async (order: any, customer: any) => {
  const html = `
    <div style="font-family: sans-serif; color: #1e293b;">
      <h2 style="color: #f97316;">Your SHUBOX Order has Shipped! 🚚</h2>
      <p>Hi ${customer.fullName},</p>
      <p>Good news! Your Order <strong>#INV-${order.id.toString().padStart(6,'0')}</strong> has been dispatched.</p>
      <div style="background: #f1f5f9; padding: 15px; border-radius: 4px; border-left: 4px solid #f97316;">
         <p style="margin: 0;"><strong>Estimated Delivery:</strong> 3-5 Business Days</p>
         <br/>
         <p style="margin: 0;"><strong>Dispatch Address:</strong></p>
         <p style="margin: 0; color: #64748b;">${customer.address || 'N/A'}</p>
      </div>
      <p>Please ensure someone is available at the site to receive the bulk cargo.</p>
    </div>
  `;
  return sendEmail(customer.email, `Your Order #INV-${order.id.toString().padStart(6,'0')} has Shipped`, html);
};
