/**
 * Domain Types for Bagy Loyalty Platform & Google Merchant Center Integration
 * Conforms to Google Merchant Center Loyalty Program specification:
 * https://support.google.com/merchants/answer/12827255?hl=en
 * https://support.google.com/merchants/answer/15500486?hl=pt-BR
 */

export type TierLevel = 'BRONZE' | 'PRATA' | 'OURO' | 'VIP';
export type UserRole = 'ADMIN' | 'MEMBER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tier?: TierLevel;
  avatarUrl?: string;
  googleAccountLinked: boolean;
  pointsBalance?: number;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  label: TierLevel;
  minPointsToQualify: number;
  pointsMultiplier: number; // e.g. 1.0 = 1 pt/R$, 1.3 = 1.3 pt/R$, 1.8 = 1.8 pt/R$, 2.5 = 2.5 pt/R$
  memberDiscountPercent: number; // e.g. 5% off for Prata, 10% off for Ouro, 18% off for VIP
  hasFreeShipping: boolean;
  freeShippingMinSpend: number; // 0 for unlimited, or e.g. 149 for members vs 299 for public
  cashbackPercent: number; // e.g. 3%, 5%, 8%, 12%
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  perks: string[];
}

export interface CustomerAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string; // UF: SP, RJ, MG, etc.
}

export interface CustomerProfile {
  cpf: string;
  birthDate: string; // DD/MM/AAAA or YYYY-MM-DD
  gender?: 'M' | 'F' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phone: string;
  address: CustomerAddress;
  favoriteBrands?: string[];
  preferredSizes?: {
    shirts?: string; // P, M, G, GG, XGG
    shoes?: string;  // 38, 39, 40, 41, 42, 43, 44
  };
  receiveWhatsappNotifications: boolean;
  receiveEmailNotifications: boolean;
  profileCompleted: boolean;
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
  profile?: CustomerProfile;
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
  program_label: string; // e.g. "Clube Fidelidade Secret Outlet"
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
  gmcAccountId: string; // e.g. '118399377' for Secret Outlet
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
  memberRepurchaseRate: number; // percentage, e.g. 46.4%
  nonMemberRepurchaseRate: number; // e.g. 15.2%
  memberAvgLtvBrl: number; // e.g. 564.80
  nonMemberAvgLtvBrl: number; // e.g. 189.50
  freeShippingOrdersCount: number;
  freeShippingCostBrl: number;
  freeShippingRevenueBrl: number;
  freeShippingRoiPercent: number; // (Revenue - Cost) / Cost
  gmcImpressionBoostPercent: number; // e.g. +37.8%
  gmcCtrBoostPercent: number; // e.g. +24.5%
}
