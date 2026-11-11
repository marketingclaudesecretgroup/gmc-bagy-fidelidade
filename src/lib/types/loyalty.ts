/**
 * Domain Types for Bagy Loyalty Platform & Google Merchant Center Integration
 * Conforms to Google Merchant Center Loyalty Program specification:
 * https://support.google.com/merchants/answer/12827255?hl=en
 * https://support.google.com/merchants/answer/15500486?hl=pt-BR
 */

export type TierLevel = 'BRONZE' | 'PRATA' | 'OURO' | 'VIP';

export interface LoyaltyTier {
  id: string;
  name: string;
  label: TierLevel;
  minPointsToQualify: number;
  pointsMultiplier: number; // e.g. 1.0 = 1 pt/R$, 1.5 = 1.5 pt/R$, 2.0 = 2 pt/R$
  memberDiscountPercent: number; // e.g. 5% off for Prata, 10% off for Ouro, 15% off for VIP
  hasFreeShipping: boolean;
  freeShippingMinSpend: number; // 0 for unlimited, or e.g. 149 for members vs 299 for public
  cashbackPercent: number; // e.g. 3%, 5%, 8%, 10%
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  perks: string[];
}

export interface LoyaltyMember {
  id: string;
  bagyCustomerId: string;
  name: string;
  email: string;
  phone?: string;
  tier: TierLevel;
  pointsBalance: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalOrdersCount: number;
  totalSpendBrl: number;
  joinedAt: string;
  updatedAt: string;
  googleAccountLinked: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PointsTransaction {
  id: string;
  memberId: string;
  bagyOrderId?: string;
  type: 'EARNED_PURCHASE' | 'EARNED_BONUS' | 'REDEEMED_COUPON' | 'EXPIRED' | 'MANUAL_ADJUSTMENT';
  points: number;
  description: string;
  createdAt: string;
}

export interface BagyCoupon {
  id: string;
  code: string;
  bagyCouponId?: string;
  memberId: string;
  memberEmail: string;
  discountType: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'FREE_SHIPPING';
  value: number; // e.g., 20.00 BRL or 10%
  minCartValue: number;
  pointsSpent: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  usedAt?: string;
}

export interface ProductCatalogItem {
  id: string;
  bagyProductId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  brand: string;
  category: string;
  regularPrice: number;
  salePrice?: number;
  currency: string;
  sku: string;
  gtin?: string;
  availability: 'in_stock' | 'out_of_stock';
  loyaltyBenefitActive: boolean;
}

/**
 * GMC Loyalty Program Feed Sub-Attributes
 * Matches Google Merchant Center XML and TSV spec
 */
export interface GMCLoyaltyAttribute {
  program_label: string; // e.g. "Clube Fidelidade Bagy"
  tier_label: TierLevel; // "BRONZE" | "PRATA" | "OURO" | "VIP"
  price: string; // e.g. "179.90 BRL" (Member price)
  cashback_for_future_use?: string; // e.g. "15.00 BRL"
  loyalty_points?: number; // e.g. 180
  member_price_effective_date?: string; // e.g. "2026-01-01T00:00:00Z/2026-12-31T23:59:59Z"
  shipping_label?: string; // e.g. "loyalty_free_shipping"
}

export interface ProgramConfig {
  programName: string;
  programSlug: string;
  storeName: string;
  storeUrl: string;
  bagyStoreId: string;
  bagyApiKey: string;
  bagyWebhookSecret: string;
  pointsPerReal: number;
  pointValueInBrl: number; // e.g. 100 points = R$ 5,00 (0.05 BRL per point)
  pointsExpirationDays: number;
  gmcShippingLabel: string;
  gmcProgramLabel: string;
  gmcFeedUrl: string;
  gmcEnabled: boolean;
  tiers: LoyaltyTier[];
}

export interface BagyWebhookPayload {
  event: 'order.created' | 'order.paid' | 'order.cancelled' | 'customer.created';
  timestamp: string;
  data: {
    id: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
    total: number;
    subtotal: number;
    discount?: number;
    coupon_code?: string;
    status: string;
    items?: Array<{
      id: string;
      product_id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface MetricsSummary {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  pointsLiabilityBrl: number;
  memberRepurchaseRate: number; // percentage, e.g. 43.8%
  nonMemberRepurchaseRate: number; // e.g. 14.2%
  memberAvgLtvBrl: number; // e.g. 540.00
  nonMemberAvgLtvBrl: number; // e.g. 192.00
  freeShippingOrdersCount: number;
  freeShippingCostBrl: number;
  freeShippingRevenueBrl: number;
  freeShippingRoiPercent: number; // (Revenue - Cost) / Cost
  gmcImpressionBoostPercent: number; // e.g. +34%
  gmcCtrBoostPercent: number; // e.g. +22%
}
