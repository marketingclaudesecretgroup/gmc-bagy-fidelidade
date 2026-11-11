import {
  LoyaltyTier,
  LoyaltyMember,
  PointsTransaction,
  BagyCoupon,
  ProductCatalogItem,
  ProgramConfig,
  MetricsSummary,
  TierLevel,
  AuthUser,
  UserRole
} from '../types/loyalty';

// Default Tier Configuration conforming to Google Merchant Center loyalty guidelines
export const DEFAULT_TIERS: LoyaltyTier[] = [
  {
    id: 'tier-bronze',
    name: 'Bronze',
    label: 'BRONZE',
    minPointsToQualify: 0,
    pointsMultiplier: 1.0,
    memberDiscountPercent: 5,
    hasFreeShipping: false,
    freeShippingMinSpend: 199,
    cashbackPercent: 3,
    color: '#CD7F32',
    badgeBg: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
    badgeBorder: 'border-amber-700/50',
    description: 'Entrada automática no clube ao cadastrar na Secret Outlet ou vincular Conta Google.',
    perks: [
      '1 ponto a cada R$ 1,00 gasto na Secret Outlet',
      '5% OFF em produtos selecionados no Google Shopping',
      '3% de cashback para compras futuras',
      'Cupom de R$ 15 no mês de aniversário'
    ]
  },
  {
    id: 'tier-prata',
    name: 'Prata',
    label: 'PRATA',
    minPointsToQualify: 500,
    pointsMultiplier: 1.3,
    memberDiscountPercent: 8,
    hasFreeShipping: true,
    freeShippingMinSpend: 149,
    cashbackPercent: 5,
    color: '#C0C0C0',
    badgeBg: 'bg-slate-800/80 text-slate-200 border-slate-600/60',
    badgeBorder: 'border-slate-500/50',
    description: 'Para clientes com compras acumuladas acima de R$ 500.',
    perks: [
      '1.3 pontos a cada R$ 1,00 gasto',
      '8% OFF exclusivo para membros',
      'Frete Grátis acima de R$ 149 (público geral é R$ 299)',
      '5% de cashback para compras futuras',
      'Acesso antecipado a lançamentos e promoções'
    ]
  },
  {
    id: 'tier-ouro',
    name: 'Ouro',
    label: 'OURO',
    minPointsToQualify: 1500,
    pointsMultiplier: 1.8,
    memberDiscountPercent: 12,
    hasFreeShipping: true,
    freeShippingMinSpend: 99,
    cashbackPercent: 8,
    color: '#FFD700',
    badgeBg: 'bg-yellow-950/50 text-yellow-300 border-yellow-600/60',
    badgeBorder: 'border-yellow-500/50',
    description: 'Para clientes frequentes com mais de R$ 1.500 acumulados.',
    perks: [
      '1.8 pontos a cada R$ 1,00 gasto',
      '12% OFF exclusivo com badge no Google Shopping',
      'Frete Grátis acima de apenas R$ 99',
      '8% de cashback acumulado na carteira',
      'Atendimento prioritário no WhatsApp',
      'Brindes em pedidos especiais'
    ]
  },
  {
    id: 'tier-vip',
    name: 'VIP Black',
    label: 'VIP',
    minPointsToQualify: 3500,
    pointsMultiplier: 2.5,
    memberDiscountPercent: 18,
    hasFreeShipping: true,
    freeShippingMinSpend: 0, // Zero minimum spend!
    cashbackPercent: 12,
    color: '#A855F7',
    badgeBg: 'bg-purple-950/60 text-purple-300 border-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    badgeBorder: 'border-purple-500/60',
    description: 'Nível supremo de fidelidade com privilégios absolutos.',
    perks: [
      '2.5 pontos a cada R$ 1,00 gasto (máxima pontuação)',
      '18% OFF em todo o catálogo da Secret Outlet',
      'FRETE GRÁTIS ILIMITADO sem valor mínimo',
      '12% de cashback para compras futuras',
      'Canal de concierge VIP direto',
      'Presentes exclusivos de aniversário'
    ]
  }
];

export const DEFAULT_CONFIG: ProgramConfig = {
  programName: 'Clube Fidelidade Secret Outlet',
  programSlug: 'clube-fidelidade',
  storeName: 'Secret Outlet',
  storeUrl: 'https://www.secretoutlet.com.br',
  gmcAccountId: '118399377',
  bagyStoreId: 'bagy_str_994208',
  bagyApiKey: 'bagy_live_sec_7894321bca981023fe',
  bagyWebhookSecret: 'whsec_98fba671b402e1c78491a',
  pointsPerReal: 1.0,
  pointValueInBrl: 0.05, // 100 points = R$ 5,00
  pointsExpirationDays: 365,
  gmcShippingLabel: 'loyalty_free_shipping',
  gmcProgramLabel: 'Clube Fidelidade Secret Outlet',
  gmcFeedUrl: '/api/gmc/feed.xml',
  gmcEnabled: true,
  tiers: DEFAULT_TIERS
};

export const INITIAL_PRODUCTS: ProductCatalogItem[] = [
  {
    id: 'prod-001',
    bagyProductId: 'bagy_prd_1001',
    title: 'Camisa Polo Piquet Masculina Tommy Hilfiger Classic',
    description: 'Algodão egípcio de alto padrão, caimento impecável, logo bordado original e durabilidade extrema.',
    link: 'https://www.secretoutlet.com.br/produtos/camisa-polo-piquet-tommy-hilfiger',
    imageLink: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    brand: 'Tommy Hilfiger',
    category: 'Vestuário > Camisas Polo',
    regularPrice: 389.90,
    salePrice: 349.90,
    currency: 'BRL',
    sku: 'SO-TH-POLO-001',
    gtin: '7891234567890',
    availability: 'in_stock',
    loyaltyBenefitActive: true
  },
  {
    id: 'prod-002',
    bagyProductId: 'bagy_prd_1002',
    title: 'Tênis Casual Couro Lacoste Carnaby EVO Original',
    description: 'Couro nobre legítimo, solado antiderrapante vulcanizado e o clássico crocodilo verde aplicado.',
    link: 'https://www.secretoutlet.com.br/produtos/tenis-casual-couro-lacoste-carnaby',
    imageLink: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Lacoste',
    category: 'Calçados > Tênis Casuais',
    regularPrice: 699.00,
    salePrice: 599.00,
    currency: 'BRL',
    sku: 'SO-LAC-TNS-002',
    gtin: '7891234567891',
    availability: 'in_stock',
    loyaltyBenefitActive: true
  },
  {
    id: 'prod-003',
    bagyProductId: 'bagy_prd_1003',
    title: 'Jaqueta Puffer Térmica Calvin Klein Waterproof Black',
    description: 'Enchimento térmico ultra leve, acabamento resistente à água, gola alta corta-vento e forro em fleece.',
    link: 'https://www.secretoutlet.com.br/produtos/jaqueta-puffer-calvin-klein',
    imageLink: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    brand: 'Calvin Klein',
    category: 'Vestuário > Casacos & Jaquetas',
    regularPrice: 799.90,
    salePrice: 699.90,
    currency: 'BRL',
    sku: 'SO-CK-JQT-003',
    gtin: '7891234567892',
    availability: 'in_stock',
    loyaltyBenefitActive: true
  },
  {
    id: 'prod-004',
    bagyProductId: 'bagy_prd_1004',
    title: 'Calça Jeans Slim Fit Reserva Confort Denim',
    description: 'Jeans com elastano de alta flexibilidade, lavagem moderna média e costura reforçada para uso diário.',
    link: 'https://www.secretoutlet.com.br/produtos/calca-jeans-slim-reserva',
    imageLink: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    brand: 'Reserva',
    category: 'Vestuário > Calças Jeans',
    regularPrice: 429.00,
    salePrice: 389.00,
    currency: 'BRL',
    sku: 'SO-RSV-JNS-004',
    gtin: '7891234567893',
    availability: 'in_stock',
    loyaltyBenefitActive: true
  },
  {
    id: 'prod-005',
    bagyProductId: 'bagy_prd_1005',
    title: 'Mochila Executiva Couro Legitimo John John Urban',
    description: 'Compartimento acolchoado para notebook até 16 polegadas, alças ergonômicas e zíperes YKK.',
    link: 'https://www.secretoutlet.com.br/produtos/mochila-executiva-couro-john-john',
    imageLink: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'John John',
    category: 'Acessórios > Mochilas & Malas',
    regularPrice: 489.90,
    currency: 'BRL',
    sku: 'SO-JJ-MCB-005',
    gtin: '7891234567894',
    availability: 'in_stock',
    loyaltyBenefitActive: true
  }
];

export const INITIAL_MEMBERS: LoyaltyMember[] = [
  {
    id: 'mem-001',
    bagyCustomerId: 'bagy_cus_501',
    name: 'Carolina Mendes Ramos',
    email: 'carolina.mendes@gmail.com',
    phone: '(11) 98765-4321',
    tier: 'VIP',
    pointsBalance: 4250,
    totalPointsEarned: 6100,
    totalPointsRedeemed: 1850,
    totalOrdersCount: 9,
    totalSpendBrl: 3820.50,
    joinedAt: '2025-08-14T10:30:00Z',
    updatedAt: '2026-02-10T14:22:00Z',
    googleAccountLinked: true,
    status: 'ACTIVE'
  },
  {
    id: 'mem-002',
    bagyCustomerId: 'bagy_cus_502',
    name: 'Rodrigo Silveira Alves',
    email: 'rodrigo.silveira@outlook.com',
    phone: '(21) 99876-1234',
    tier: 'OURO',
    pointsBalance: 1840,
    totalPointsEarned: 2440,
    totalPointsRedeemed: 600,
    totalOrdersCount: 5,
    totalSpendBrl: 1680.00,
    joinedAt: '2025-10-02T16:15:00Z',
    updatedAt: '2026-03-01T09:11:00Z',
    googleAccountLinked: true,
    status: 'ACTIVE'
  },
  {
    id: 'mem-003',
    bagyCustomerId: 'bagy_cus_503',
    name: 'Juliana Paes Ferreira',
    email: 'juliana.pf@gmail.com',
    phone: '(31) 97654-3210',
    tier: 'PRATA',
    pointsBalance: 620,
    totalPointsEarned: 820,
    totalPointsRedeemed: 200,
    totalOrdersCount: 3,
    totalSpendBrl: 640.00,
    joinedAt: '2025-12-19T11:45:00Z',
    updatedAt: '2026-02-28T18:04:00Z',
    googleAccountLinked: false,
    status: 'ACTIVE'
  },
  {
    id: 'mem-004',
    bagyCustomerId: 'bagy_cus_504',
    name: 'Lucas Henrique Dias',
    email: 'lucas.henrique@gmail.com',
    phone: '(41) 98123-4567',
    tier: 'BRONZE',
    pointsBalance: 210,
    totalPointsEarned: 210,
    totalPointsRedeemed: 0,
    totalOrdersCount: 1,
    totalSpendBrl: 210.00,
    joinedAt: '2026-01-25T15:20:00Z',
    updatedAt: '2026-01-25T15:20:00Z',
    googleAccountLinked: true,
    status: 'ACTIVE'
  }
];

export const INITIAL_COUPONS: BagyCoupon[] = [
  {
    id: 'coup-001',
    code: 'VIP-GOLD-7X9B',
    bagyCouponId: 'bagy_cpn_881',
    memberId: 'mem-001',
    memberEmail: 'carolina.mendes@gmail.com',
    discountType: 'FIXED_AMOUNT',
    value: 50.00,
    minCartValue: 150.00,
    pointsSpent: 1000,
    status: 'ACTIVE',
    expiresAt: '2026-04-10T23:59:59Z',
    createdAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'coup-002',
    code: 'CLUBE-PRATA-20',
    bagyCouponId: 'bagy_cpn_882',
    memberId: 'mem-003',
    memberEmail: 'juliana.pf@gmail.com',
    discountType: 'FIXED_AMOUNT',
    value: 20.00,
    minCartValue: 100.00,
    pointsSpent: 400,
    status: 'USED',
    expiresAt: '2026-03-15T23:59:59Z',
    createdAt: '2026-02-15T10:00:00Z',
    usedAt: '2026-02-28T18:04:00Z'
  }
];

export const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  {
    id: 'tx-001',
    memberId: 'mem-001',
    bagyOrderId: 'so-ord-901',
    type: 'EARNED_PURCHASE',
    points: 750,
    description: 'Pontos do Pedido Secret Outlet #so-ord-901 (Multiplicador VIP 2.5x)',
    createdAt: '2026-02-10T14:22:00Z'
  },
  {
    id: 'tx-002',
    memberId: 'mem-001',
    type: 'REDEEMED_COUPON',
    points: -1000,
    description: 'Resgate de Cupom de R$ 50 OFF (VIP-GOLD-7X9B)',
    createdAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'tx-003',
    memberId: 'mem-002',
    bagyOrderId: 'so-ord-887',
    type: 'EARNED_PURCHASE',
    points: 540,
    description: 'Pontos do Pedido Secret Outlet #so-ord-887 (Multiplicador Ouro 1.8x)',
    createdAt: '2026-03-01T09:11:00Z'
  }
];

class LoyaltyStore {
  private config: ProgramConfig = { ...DEFAULT_CONFIG };
  private members: Map<string, LoyaltyMember> = new Map();
  private products: Map<string, ProductCatalogItem> = new Map();
  private coupons: Map<string, BagyCoupon> = new Map();
  private transactions: PointsTransaction[] = [];
  private users: Map<string, AuthUser> = new Map();

  constructor() {
    INITIAL_MEMBERS.forEach(m => this.members.set(m.email.toLowerCase(), { ...m }));
    INITIAL_PRODUCTS.forEach(p => this.products.set(p.id, { ...p }));
    INITIAL_COUPONS.forEach(c => this.coupons.set(c.code, { ...c }));
    this.transactions = [...INITIAL_TRANSACTIONS];

    // Seed Admin Account
    this.users.set('admin@secretoutlet.com.br', {
      id: 'usr-admin-01',
      email: 'admin@secretoutlet.com.br',
      name: 'Equipe Secret Outlet (Admin)',
      role: 'ADMIN',
      googleAccountLinked: true
    });

    // Seed Members in Auth Users
    INITIAL_MEMBERS.forEach(m => {
      this.users.set(m.email.toLowerCase(), {
        id: m.id,
        email: m.email.toLowerCase(),
        name: m.name,
        role: 'MEMBER',
        tier: m.tier,
        googleAccountLinked: m.googleAccountLinked,
        pointsBalance: m.pointsBalance
      });
    });
  }

  // Auth methods
  public authenticateUser(email: string): AuthUser | null {
    const normalized = email.toLowerCase().trim();
    const user = this.users.get(normalized);
    if (user) {
      if (user.role === 'MEMBER') {
        const member = this.getMemberByEmail(normalized);
        if (member) {
          user.pointsBalance = member.pointsBalance;
          user.tier = member.tier;
        }
      }
      return { ...user };
    }

    // Auto-create as member if not existing
    return this.authenticateWithGoogle(normalized, email.split('@')[0]);
  }

  public authenticateWithGoogle(email: string, name?: string, avatarUrl?: string): AuthUser {
    const normalized = email.toLowerCase().trim();
    const existing = this.users.get(normalized);

    if (existing) {
      existing.googleAccountLinked = true;
      if (name) existing.name = name;
      if (avatarUrl) existing.avatarUrl = avatarUrl;
      const member = this.getMemberByEmail(normalized);
      if (member) {
        member.googleAccountLinked = true;
        existing.pointsBalance = member.pointsBalance;
        existing.tier = member.tier;
      }
      return { ...existing };
    }

    // New member registered via Google
    const member = this.createOrUpdateMember({
      name: name || email.split('@')[0],
      email: normalized,
      googleAccountLinked: true
    });

    const newUser: AuthUser = {
      id: member.id,
      email: normalized,
      name: member.name,
      role: 'MEMBER',
      tier: member.tier,
      avatarUrl,
      googleAccountLinked: true,
      pointsBalance: member.pointsBalance
    };

    this.users.set(normalized, newUser);
    return newUser;
  }

  public registerUser(name: string, email: string): AuthUser {
    const normalized = email.toLowerCase().trim();
    const existing = this.users.get(normalized);
    if (existing) return existing;

    const member = this.createOrUpdateMember({
      name,
      email: normalized,
      googleAccountLinked: false
    });

    const newUser: AuthUser = {
      id: member.id,
      email: normalized,
      name,
      role: 'MEMBER',
      tier: member.tier,
      googleAccountLinked: false,
      pointsBalance: member.pointsBalance
    };

    this.users.set(normalized, newUser);
    return newUser;
  }

  public getUserByEmail(email: string): AuthUser | undefined {
    return this.users.get(email.toLowerCase().trim());
  }

  public getConfig(): ProgramConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ProgramConfig>): ProgramConfig {
    this.config = { ...this.config, ...newConfig };
    return { ...this.config };
  }

  public getTiers(): LoyaltyTier[] {
    return [...this.config.tiers];
  }

  public getTierByLevel(level: TierLevel): LoyaltyTier {
    const tier = this.config.tiers.find(t => t.label === level);
    return tier || this.config.tiers[0];
  }

  public calculateTier(totalSpend: number): TierLevel {
    if (totalSpend >= 3500) return 'VIP';
    if (totalSpend >= 1500) return 'OURO';
    if (totalSpend >= 500) return 'PRATA';
    return 'BRONZE';
  }

  public getAllMembers(): LoyaltyMember[] {
    return Array.from(this.members.values());
  }

  public getMemberByEmail(email: string): LoyaltyMember | undefined {
    return this.members.get(email.toLowerCase());
  }

  public getMemberById(id: string): LoyaltyMember | undefined {
    return Array.from(this.members.values()).find(m => m.id === id);
  }

  public createOrUpdateMember(memberData: Partial<LoyaltyMember> & { email: string }): LoyaltyMember {
    const normalizedEmail = memberData.email.toLowerCase();
    const existing = this.members.get(normalizedEmail);

    if (existing) {
      const updated: LoyaltyMember = {
        ...existing,
        ...memberData,
        updatedAt: new Date().toISOString()
      };
      this.members.set(normalizedEmail, updated);
      return updated;
    }

    const newMember: LoyaltyMember = {
      id: `mem-${Date.now().toString(36)}`,
      bagyCustomerId: memberData.bagyCustomerId || `bagy_cus_${Math.floor(1000 + Math.random() * 9000)}`,
      name: memberData.name || 'Cliente Secret Outlet',
      email: normalizedEmail,
      phone: memberData.phone,
      tier: memberData.tier || 'BRONZE',
      pointsBalance: memberData.pointsBalance || 100, // 100 welcome bonus points!
      totalPointsEarned: memberData.totalPointsEarned || 100,
      totalPointsRedeemed: memberData.totalPointsRedeemed || 0,
      totalOrdersCount: memberData.totalOrdersCount || 0,
      totalSpendBrl: memberData.totalSpendBrl || 0,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      googleAccountLinked: memberData.googleAccountLinked ?? true,
      status: 'ACTIVE'
    };

    this.members.set(normalizedEmail, newMember);

    // Register welcome bonus transaction
    this.addTransaction({
      memberId: newMember.id,
      type: 'EARNED_BONUS',
      points: 100,
      description: 'Bônus de boas-vindas ao Clube Fidelidade Secret Outlet'
    });

    return newMember;
  }

  public addPoints(email: string, points: number, description: string, bagyOrderId?: string): LoyaltyMember {
    const member = this.getMemberByEmail(email);
    if (!member) throw new Error(`Member with email ${email} not found`);

    member.pointsBalance += points;
    member.totalPointsEarned += points;
    member.updatedAt = new Date().toISOString();

    this.members.set(email.toLowerCase(), member);

    this.addTransaction({
      memberId: member.id,
      bagyOrderId,
      type: 'EARNED_PURCHASE',
      points,
      description
    });

    return member;
  }

  public addTransaction(tx: Omit<PointsTransaction, 'id' | 'createdAt'>): PointsTransaction {
    const newTx: PointsTransaction = {
      id: `tx-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      ...tx,
      createdAt: new Date().toISOString()
    };
    this.transactions.unshift(newTx);
    return newTx;
  }

  public getTransactionsByMember(memberId: string): PointsTransaction[] {
    return this.transactions.filter(t => t.memberId === memberId);
  }

  public getAllTransactions(): PointsTransaction[] {
    return [...this.transactions];
  }

  public getAllCoupons(): BagyCoupon[] {
    return Array.from(this.coupons.values());
  }

  public getCouponsByMember(memberEmail: string): BagyCoupon[] {
    return Array.from(this.coupons.values()).filter(c => c.memberEmail.toLowerCase() === memberEmail.toLowerCase());
  }

  public createCoupon(coupon: Omit<BagyCoupon, 'id' | 'createdAt'>): BagyCoupon {
    const newCoupon: BagyCoupon = {
      id: `coup-${Date.now().toString(36)}`,
      ...coupon,
      createdAt: new Date().toISOString()
    };
    this.coupons.set(newCoupon.code, newCoupon);
    return newCoupon;
  }

  public getAllProducts(): ProductCatalogItem[] {
    return Array.from(this.products.values());
  }

  public getProductById(id: string): ProductCatalogItem | undefined {
    return this.products.get(id);
  }

  public updateProduct(id: string, updates: Partial<ProductCatalogItem>): ProductCatalogItem | undefined {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  public getMetrics(): MetricsSummary {
    const members = this.getAllMembers();
    const active = members.filter(m => m.status === 'ACTIVE');
    const totalIssued = members.reduce((acc, m) => acc + m.totalPointsEarned, 0);
    const totalRedeemed = members.reduce((acc, m) => acc + m.totalPointsRedeemed, 0);
    const totalPointsRemaining = members.reduce((acc, m) => acc + m.pointsBalance, 0);

    return {
      totalMembers: members.length,
      activeMembers: active.length,
      newMembersThisMonth: Math.max(1, Math.round(members.length * 0.28)),
      totalPointsIssued: totalIssued,
      totalPointsRedeemed: totalRedeemed,
      pointsLiabilityBrl: Number((totalPointsRemaining * this.config.pointValueInBrl).toFixed(2)),
      memberRepurchaseRate: 46.4,
      nonMemberRepurchaseRate: 15.2,
      memberAvgLtvBrl: 564.80,
      nonMemberAvgLtvBrl: 189.50,
      freeShippingOrdersCount: 284,
      freeShippingCostBrl: 5396.00,
      freeShippingRevenueBrl: 42600.00,
      freeShippingRoiPercent: 689.5, // 6.9x return on free shipping loyalty investment!
      gmcImpressionBoostPercent: 37.8,
      gmcCtrBoostPercent: 24.5
    };
  }
}

// Global Singleton for in-memory and persistent operations in Next.js
declare global {
  var __loyaltyStore: LoyaltyStore | undefined;
}

export const loyaltyStore = global.__loyaltyStore || (global.__loyaltyStore = new LoyaltyStore());
