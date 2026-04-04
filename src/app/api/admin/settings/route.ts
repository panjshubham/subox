import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
