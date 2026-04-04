import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { mobile, password } = json;

    if (!mobile || !password) {
      return NextResponse.json({ error: 'Mobile and password is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobile }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid mobile or password.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid mobile or password.' }, { status: 401 });
    }

    await setSessionCookie({ userId: user.id, mobile: user.mobile, fullName: user.fullName });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
