import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logout realizado' });
  response.cookies.delete('so_auth_user');
  return response;
}
