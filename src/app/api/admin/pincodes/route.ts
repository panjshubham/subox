import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

// Fetch all serviceable pincodes — public, used by DeliveryChecker component
export async function GET() {
  try {
    const list = await prisma.serviceablePincode.findMany({
      orderBy: { state: 'asc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Failed to fetch pincodes:', error);
    return NextResponse.json({ error: 'Failed to fetch pincodes' }, { status: 500 });
  }
}

// Mass-upsert rules — admin only
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pins, city, state } = await request.json();

    if (!pins || !city || !state) {
      return NextResponse.json({ error: 'pins, city and state are required' }, { status: 400 });
    }

    // pins is expected to be a comma-separated string like "700015, 700016"
    const codes = (pins as string)
      .split(',')
      .map((p: string) => p.trim())
      .filter((p: string) => p.length === 6);

    if (codes.length === 0) {
      return NextResponse.json({ error: 'No valid 6-digit pincodes found' }, { status: 400 });
    }

    let count = 0;
    for (const code of codes) {
      await prisma.serviceablePincode.upsert({
        where: { code },
        update: { city, state },
        create: { code, city, state },
      });
      count++;
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Failed to upsert pincodes:', error);
    return NextResponse.json({ error: 'Failed to mass upsert pincodes' }, { status: 500 });
  }
}

// Delete a single pincode — admin only
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No pincode provided' }, { status: 400 });
    }

    await prisma.serviceablePincode.delete({ where: { code } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete pincode:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
