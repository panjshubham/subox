import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');

  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: 'Invalid pincode format' }, { status: 400 });
  }

  try {
    const serviceable = await prisma.serviceablePincode.findUnique({
      where: { code: pin }
    });

    if (!serviceable) {
      return NextResponse.json({ deliverable: false });
    }

    // Math out the dates
    const daysToAdd = serviceable.state.toLowerCase() === 'west bengal' ? 4 : 7;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

    // Skip Sundays optionally? Simple is best for now
    const displayDate = estimatedDate.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short'
    });

    return NextResponse.json({
      deliverable: true,
      city: serviceable.city,
      estimatedDate: displayDate,
      days: daysToAdd
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
