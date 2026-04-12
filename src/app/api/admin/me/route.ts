import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Lightweight admin session check — used by the admin page on mount
// Returns just the mobile so we can check if admin without loading all orders
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    mobile: session.mobile,
    fullName: session.fullName,
    isAdmin: session.mobile === '9830234950',
  });
}
