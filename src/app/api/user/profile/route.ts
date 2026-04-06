import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { 
      mobile: true, email: true, fullName: true, companyName: true, gstNumber: true, address: true,
       orders: {
         orderBy: { createdAt: 'desc' },
         include: { items: true }
       }
    }
  });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await request.json();
    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        companyName: json.companyName,
        gstNumber: json.gstNumber,
        address: json.address,
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}
