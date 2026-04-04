import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { fullName, email, mobile, password, gstNumber, companyName } = json;

    if (!mobile || !password || password.length < 6) {
      return NextResponse.json({ error: 'Mobile and password (min 6 chars) are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { mobile }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this mobile number already exists.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile,
        passwordHash,
        gstNumber,
        companyName,
      }
    });

    // Automatically log them in after registration
    await setSessionCookie({ userId: user.id, mobile: user.mobile, fullName: user.fullName });

    return NextResponse.json({ success: true, message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating account' }, { status: 500 });
  }
}
