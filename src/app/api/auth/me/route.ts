import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';
import { AuthUser } from '@/lib/types/loyalty';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('so_auth_user');

  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const parsed: AuthUser = JSON.parse(cookie.value);
    const refreshed = loyaltyStore.getUserByEmail(parsed.email);

    if (refreshed) {
      if (refreshed.role === 'MEMBER') {
        const member = loyaltyStore.getMemberByEmail(refreshed.email);
        if (member) {
          refreshed.pointsBalance = member.pointsBalance;
          refreshed.tier = member.tier;
        }
      }
      return NextResponse.json({ authenticated: true, user: refreshed });
    }

    return NextResponse.json({ authenticated: true, user: parsed });
  } catch (e) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
