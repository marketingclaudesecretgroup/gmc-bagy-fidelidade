import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 });
    }

    const user = loyaltyStore.registerUser(name, email);

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Cadastro efetuado! 100 pontos de boas-vindas foram creditados.'
    });

    response.cookies.set('so_auth_user', JSON.stringify(user), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro no cadastro' }, { status: 500 });
  }
}
