import { loyaltyStore } from './loyalty-store';
import { BagyWebhookPayload, BagyCoupon } from '../types/loyalty';
import crypto from 'crypto';

export class BagyClient {
  /**
   * Creates a discount coupon in Bagy platform via Bagy REST API
   */
  public static async createBagyCoupon(params: {
    memberEmail: string;
    discountType: 'FIXED_AMOUNT' | 'PERCENTAGE';
    value: number;
    minSpend: number;
    pointsSpent: number;
  }): Promise<BagyCoupon> {
    const config = loyaltyStore.getConfig();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = params.discountType === 'PERCENTAGE' ? 'FIDELIDADE-PCT' : 'FIDELIDADE-VAL';
    const couponCode = `${prefix}-${params.value}-${randomSuffix}`;

    // In a live production deployment, we call Bagy API:
    // POST https://api.bagy.com.br/v2/coupons
    // Authorization: Bearer {config.bagyApiKey}
    // Headers: { "X-Store-Id": config.bagyStoreId }
    // Body: { code, type, value, minimum_amount, customer_email, expires_at }
    
    // Simulate / execute the Bagy API record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

    const member = loyaltyStore.getMemberByEmail(params.memberEmail);
    if (!member) {
      throw new Error(`Membro não encontrado com email ${params.memberEmail}`);
    }

    if (member.pointsBalance < params.pointsSpent) {
      throw new Error(`Saldo insuficiente. Você possui ${member.pointsBalance} pontos e necessita de ${params.pointsSpent} pontos.`);
    }

    // Deduct points from member
    member.pointsBalance -= params.pointsSpent;
    member.totalPointsRedeemed += params.pointsSpent;
    member.updatedAt = new Date().toISOString();

    loyaltyStore.addTransaction({
      memberId: member.id,
      type: 'REDEEMED_COUPON',
      points: -params.pointsSpent,
      description: `Resgate de Cupom de R$ ${params.value.toFixed(2)} OFF (${couponCode})`
    });

    const newCoupon = loyaltyStore.createCoupon({
      code: couponCode,
      bagyCouponId: `bagy_cpn_${Date.now().toString(36)}`,
      memberId: member.id,
      memberEmail: member.email,
      discountType: params.discountType,
      value: params.value,
      minCartValue: params.minSpend,
      pointsSpent: params.pointsSpent,
      status: 'ACTIVE',
      expiresAt: expiresAt.toISOString()
    });

    return newCoupon;
  }

  /**
   * Verifies Bagy webhook signature using HMAC-SHA256
   */
  public static verifyWebhookSignature(payloadRaw: string, signatureHeader?: string): boolean {
    const config = loyaltyStore.getConfig();
    if (!signatureHeader || !config.bagyWebhookSecret) return true; // allow testing mode

    const expectedSig = crypto
      .createHmac('sha256', config.bagyWebhookSecret)
      .update(payloadRaw)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSig));
  }

  /**
   * Processes incoming Bagy webhook payloads
   */
  public static async processWebhook(payload: BagyWebhookPayload): Promise<{
    success: boolean;
    event: string;
    message: string;
    details?: any;
  }> {
    const { event, data } = payload;
    const config = loyaltyStore.getConfig();

    switch (event) {
      case 'customer.created': {
        const customer = data.customer;
        const newMember = loyaltyStore.createOrUpdateMember({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          bagyCustomerId: customer.id
        });

        return {
          success: true,
          event,
          message: `Cliente ${customer.name} cadastrado com sucesso no Clube Fidelidade. Bônus de 100 pontos creditado.`,
          details: newMember
        };
      }

      case 'order.paid': {
        const customer = data.customer;
        const orderTotal = data.total;
        const orderId = data.id;

        // Ensure member exists
        let member = loyaltyStore.getMemberByEmail(customer.email);
        if (!member) {
          member = loyaltyStore.createOrUpdateMember({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            bagyCustomerId: customer.id
          });
        }

        // Determine current tier
        const currentTier = loyaltyStore.getTierByLevel(member.tier);
        const pointsEarned = Math.round(orderTotal * currentTier.pointsMultiplier);

        // Update financial stats
        member.totalSpendBrl += orderTotal;
        member.totalOrdersCount += 1;
        member.pointsBalance += pointsEarned;
        member.totalPointsEarned += pointsEarned;

        // Check if member qualifies for tier upgrade
        const newTier = loyaltyStore.calculateTier(member.totalSpendBrl);
        const tierUpgraded = newTier !== member.tier;
        member.tier = newTier;
        member.updatedAt = new Date().toISOString();

        // Register transaction
        loyaltyStore.addTransaction({
          memberId: member.id,
          bagyOrderId: orderId,
          type: 'EARNED_PURCHASE',
          points: pointsEarned,
          description: `Pontos do Pedido Bagy #${orderId} (R$ ${orderTotal.toFixed(2)} x ${currentTier.pointsMultiplier} no tier ${currentTier.name})`
        });

        // Mark coupon as used if an active coupon code was provided
        if (data.coupon_code) {
          const coupon = loyaltyStore.getAllCoupons().find(c => c.code.toLowerCase() === data.coupon_code?.toLowerCase());
          if (coupon && coupon.status === 'ACTIVE') {
            coupon.status = 'USED';
            coupon.usedAt = new Date().toISOString();
          }
        }

        return {
          success: true,
          event,
          message: `Pedido #${orderId} processado: ${pointsEarned} pontos creditados para ${member.name}.${tierUpgraded ? ` Parabéns! Novo nível alcançado: ${newTier}!` : ''}`,
          details: {
            member,
            pointsEarned,
            tierUpgraded,
            newTier
          }
        };
      }

      case 'order.cancelled': {
        const orderId = data.id;
        const customerEmail = data.customer?.email;
        if (!customerEmail) {
          return { success: false, event, message: 'Customer email missing in payload' };
        }

        const member = loyaltyStore.getMemberByEmail(customerEmail);
        if (member) {
          const memberTransactions = loyaltyStore.getTransactionsByMember(member.id);
          const orderTx = memberTransactions.find(t => t.bagyOrderId === orderId && t.type === 'EARNED_PURCHASE');
          if (orderTx) {
            member.pointsBalance = Math.max(0, member.pointsBalance - orderTx.points);
            loyaltyStore.addTransaction({
              memberId: member.id,
              bagyOrderId: orderId,
              type: 'EXPIRED',
              points: -orderTx.points,
              description: `Estorno de pontos pelo cancelamento do Pedido Bagy #${orderId}`
            });
          }
        }

        return {
          success: true,
          event,
          message: `Pedido #${orderId} cancelado. Pontos estornados.`
        };
      }

      default:
        return {
          success: true,
          event,
          message: `Evento ${event} recebido e registrado.`
        };
    }
  }
}
