import { NextRequest, NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Parâmetro email é obrigatório' }, { status: 400 });
  }

  let member = loyaltyStore.getMemberByEmail(email);

  if (!member) {
    // Auto-enroll new visitor who checked their points in widget
    member = loyaltyStore.createOrUpdateMember({
      name: email.split('@')[0],
      email: email,
      googleAccountLinked: true
    });
  }

  const currentTier = loyaltyStore.getTierByLevel(member.tier);
  const allTiers = loyaltyStore.getTiers();
  const nextTierIndex = allTiers.findIndex(t => t.label === member?.tier) + 1;
  const nextTier = nextTierIndex < allTiers.length ? allTiers[nextTierIndex] : null;

  const pointsToNextTier = nextTier
    ? Math.max(0, nextTier.minPointsToQualify - member.totalSpendBrl)
    : 0;

  const coupons = loyaltyStore.getCouponsByMember(member.email);
  const transactions = loyaltyStore.getTransactionsByMember(member.id);

  return NextResponse.json({
    success: true,
    member,
    currentTier,
    nextTier,
    pointsToNextTier,
    coupons,
    transactions: transactions.slice(0, 10),
    config: {
      pointsPerReal: loyaltyStore.getConfig().pointsPerReal,
      pointValueInBrl: loyaltyStore.getConfig().pointValueInBrl,
      gmcProgramLabel: loyaltyStore.getConfig().gmcProgramLabel
    }
  });
}
