import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Fetch all rules — public, used by DeliveryChecker component
export async function GET() {
  const list = await prisma.serviceablePincode.findMany({
    orderBy: { state: 'asc' }
  });
  return NextResponse.json(list);
}

// Mass-upsert rules — admin only
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.mobile !== '9830234950') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { pins, city, state } = await request.json();
    
    // pins is expected to be a string like "700015, 700016"
    const codes = pins.split(',').map((p: string) => p.trim()).filter((p: string) => p.length === 6);

    let count = 0;
    for (const code of codes) {
       await prisma.serviceablePincode.upsert({
          where: { code },
          update: { city, state },
          create: { code, city, state }
       });
       count++;
    }

    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mass upsert pincodes' }, { status: 500 });
  }
}

// Mass delete or single delete — admin only
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.mobile !== '9830234950') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (code) {
       await prisma.serviceablePincode.delete({ where: { code } });
       return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
