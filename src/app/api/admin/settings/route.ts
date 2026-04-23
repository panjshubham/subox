import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

export async function GET() {
  // GET is public — used by layout.tsx for footer/header data
  try {
    let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await prisma.storeSettings.create({ data: { id: 1 } });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Failed to fetch store settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Admin-only route
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {
        businessName: json.businessName,
        brandName: json.brandName,
        gstin: json.gstin,
        address: json.address,
        phoneOne: json.phoneOne,
        phoneTwo: json.phoneTwo,
        email: json.email,
        bankName: json.bankName,
        bankBranch: json.bankBranch,
        accountNo: json.accountNo,
        ifscCode: json.ifscCode,
      },
      create: {
        id: 1,
        businessName: json.businessName,
        brandName: json.brandName,
        gstin: json.gstin,
        address: json.address,
        phoneOne: json.phoneOne,
        phoneTwo: json.phoneTwo,
        email: json.email,
        bankName: json.bankName,
        bankBranch: json.bankBranch,
        accountNo: json.accountNo,
        ifscCode: json.ifscCode,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
  }
}
