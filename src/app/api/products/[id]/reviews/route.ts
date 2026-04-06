import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must be logged in to leave a review.' }, { status: 401 });
    }

    const { rating, comment } = await req.json();
    const resolvedParams = await params;
    const productId = Number(resolvedParams.id);

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId: session.userId
      },
      include: {
        user: { select: { fullName: true, companyName: true } }
      }
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
