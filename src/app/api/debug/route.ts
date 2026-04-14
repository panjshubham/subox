import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public diagnostic endpoint — shows if DB is connected and has products
// Access: GET /api/debug (remove after confirming products show)
export async function GET() {
  try {
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({ select: { id: true, name: true, price: true, imageUrl: true } });
    const settings = await prisma.storeSettings.findFirst({ select: { id: true, email: true } });

    return NextResponse.json({
      ok: true,
      productCount: count,
      products,
      settingsId: settings?.id ?? null,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
        hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
