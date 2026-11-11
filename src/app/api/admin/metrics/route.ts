import { NextResponse } from 'next/server';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrics = loyaltyStore.getMetrics();
  const members = loyaltyStore.getAllMembers();
  const coupons = loyaltyStore.getAllCoupons();
  const tiers = loyaltyStore.getTiers();
  const config = loyaltyStore.getConfig();
  const products = loyaltyStore.getAllProducts();

  return NextResponse.json({
    success: true,
    metrics,
    membersCount: members.length,
    activeCouponsCount: coupons.filter(c => c.status === 'ACTIVE').length,
    tiers,
    config,
    products,
    recentCoupons: coupons.slice(0, 10),
    recentMembers: members.slice(0, 10)
  });
}
