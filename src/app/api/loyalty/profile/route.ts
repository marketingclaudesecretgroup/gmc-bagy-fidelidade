import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';
import { CustomerProfile } from '@/lib/types/loyalty';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Parâmetro email é obrigatório' }, { status: 400 });
  }

  const member = loyaltyStore.getMemberByEmail(email);
  if (!member) {
    return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    email: member.email,
    name: member.name,
    phone: member.phone,
    tier: member.tier,
    pointsBalance: member.pointsBalance,
    profile: member.profile || null,
    profileCompleted: Boolean(member.profile?.profileCompleted)
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, profile } = body as { email: string; profile: Partial<CustomerProfile> };

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Dados de perfil são obrigatórios' }, { status: 400 });
    }

    const { member, bonusAwarded } = loyaltyStore.updateMemberProfile(email, profile);

    return NextResponse.json({
      success: true,
      message: bonusAwarded 
        ? '🎉 Perfil salvo com sucesso! Você ganhou +150 pontos de bônus por completar seus dados!' 
        : 'Perfil atualizado com sucesso!',
      bonusAwarded,
      bonusPoints: bonusAwarded ? 150 : 0,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        tier: member.tier,
        pointsBalance: member.pointsBalance,
        profile: member.profile
      }
    });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil do cliente:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar atualização' }, { status: 500 });
  }
}
