import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

// Lightweight admin session check — used by the admin page on mount
// Returns just the mobile so we can check if admin without loading all orders
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      mobile: session.mobile,
      fullName: session.fullName,
      isAdmin: session.mobile === ADMIN_MOBILE,
    });
  } catch (error: any) {
    console.error('Failed to get admin session:', error);
    return NextResponse.json({ authenticated: false, error: 'Session error' }, { status: 500 });
  }
}
