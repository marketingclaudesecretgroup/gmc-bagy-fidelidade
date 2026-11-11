import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    const user = loyaltyStore.authenticateUser(email);
    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user
    });

    // Set HTTP cookie for server-side route guarding
    response.cookies.set('so_auth_user', JSON.stringify(user), {
      httpOnly: false, // accessible to client context
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro no login' }, { status: 500 });
  }
}
