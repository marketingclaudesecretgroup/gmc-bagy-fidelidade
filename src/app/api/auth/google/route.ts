import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatarUrl } = body;

    const userEmail = email || 'carolina.mendes@gmail.com';
    const userName = name || 'Carolina Mendes Ramos';
    const userAvatar = avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';

    const user = loyaltyStore.authenticateWithGoogle(userEmail, userName, userAvatar);

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Login com Google realizado com sucesso. Conta vinculada para Google Shopping!'
    });

    response.cookies.set('so_auth_user', JSON.stringify(user), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro no login Google' }, { status: 500 });
  }
}
