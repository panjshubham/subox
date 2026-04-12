import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  // GET is public — layout.tsx reads settings for footer/header rendering
  let settings = await prisma.storeSettings.findUnique({
    where: { id: 1 }
  });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: 1 }
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  // Admin-only route
  const session = await getSession();
  if (!session || session.mobile !== '9830234950') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
        ...json
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
  }
}
