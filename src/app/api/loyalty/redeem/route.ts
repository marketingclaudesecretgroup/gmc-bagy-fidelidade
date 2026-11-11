import { NextRequest, NextResponse } from 'next/server';
import { BagyClient } from '@/lib/services/bagy-client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, value, pointsSpent, discountType = 'FIXED_AMOUNT', minSpend = 50 } = body;

    if (!email || !value || !pointsSpent) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes: email, value, pointsSpent' }, { status: 400 });
    }

    const coupon = await BagyClient.createBagyCoupon({
      memberEmail: email,
      discountType,
      value: Number(value),
      minSpend: Number(minSpend),
      pointsSpent: Number(pointsSpent)
    });

    return NextResponse.json({
      success: true,
      coupon,
      message: `Cupom ${coupon.code} gerado com sucesso para a loja Bagy!`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha ao resgatar pontos' }, { status: 400 });
  }
}
