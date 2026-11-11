import { loyaltyStore } from './loyalty-store';
import { ProductCatalogItem, LoyaltyTier } from '../types/loyalty';

export class GMCFeedGenerator {
  /**
   * Generates standard Google Merchant Center RSS 2.0 XML with loyalty_program attributes
   */
  public static generateXmlFeed(): string {
    const config = loyaltyStore.getConfig();
    const products = loyaltyStore.getAllProducts();
    const tiers = loyaltyStore.getTiers();

    const escapeXml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const itemsXml = products.map(product => {
      // Calculate member prices and perks for each tier
      const regularPrice = product.regularPrice;
      const baseEffectivePrice = product.salePrice ?? regularPrice;

      // Build loyalty_program XML blocks for tiers
      const loyaltyProgramsXml = tiers.map(tier => {
        const discountFactor = (100 - tier.memberDiscountPercent) / 100;
        const memberPrice = (baseEffectivePrice * discountFactor).toFixed(2);
        const cashback = ((baseEffectivePrice * tier.cashbackPercent) / 100).toFixed(2);
        const pointsEarned = Math.round(baseEffectivePrice * tier.pointsMultiplier);
        const effectiveDate = '2026-01-01T00:00:00Z/2026-12-31T23:59:59Z';
        const shippingLabel = tier.hasFreeShipping ? config.gmcShippingLabel : '';

        return `      <g:loyalty_program>
        <g:program_label>${escapeXml(config.gmcProgramLabel)}</g:program_label>
        <g:tier_label>${escapeXml(tier.label)}</g:tier_label>
        <g:price>${memberPrice} BRL</g:price>
        <g:cashback_for_future_use>${cashback} BRL</g:cashback_for_future_use>
        <g:loyalty_points>${pointsEarned}</g:loyalty_points>
        <g:member_price_effective_date>${effectiveDate}</g:member_price_effective_date>${shippingLabel ? `\n        <g:shipping_label>${escapeXml(shippingLabel)}</g:shipping_label>` : ''}
      </g:loyalty_program>`;
      }).join('\n');

      return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(product.link)}</g:link>
      <g:image_link>${escapeXml(product.imageLink)}</g:image_link>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${product.availability}</g:availability>
      <g:price>${product.regularPrice.toFixed(2)} BRL</g:price>${product.salePrice ? `\n      <g:sale_price>${product.salePrice.toFixed(2)} BRL</g:sale_price>` : ''}
      <g:google_product_category>${escapeXml(product.category)}</g:google_product_category>
      <g:mpn>${escapeXml(product.sku)}</g:mpn>${product.gtin ? `\n      <g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ''}
${loyaltyProgramsXml}
    </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(config.storeName)} - Google Merchant Center Loyalty Feed</title>
    <link>${escapeXml(config.storeUrl)}</link>
    <description>Catálogo sincronizado com benefícios de membros do Google Merchant Center para lojas Bagy.</description>
${itemsXml}
  </channel>
</rss>`;
  }

  /**
   * Generates TSV (Tab-Separated Values) format for Google Merchant Center
   */
  public static generateTsvFeed(): string {
    const config = loyaltyStore.getConfig();
    const products = loyaltyStore.getAllProducts();
    const tiers = loyaltyStore.getTiers();

    const headers = [
      'id',
      'title',
      'description',
      'link',
      'image_link',
      'availability',
      'price',
      'sale_price',
      'brand',
      'mpn',
      'gtin',
      'loyalty_program'
    ].join('\t');

    const rows = products.map(product => {
      const baseEffectivePrice = product.salePrice ?? product.regularPrice;

      // Group format: program_label:tier_label:price:cashback_for_future_use:loyalty_points:member_price_effective_date:shipping_label
      const loyaltyPrograms = tiers.map(tier => {
        const discountFactor = (100 - tier.memberDiscountPercent) / 100;
        const memberPrice = `${(baseEffectivePrice * discountFactor).toFixed(2)} BRL`;
        const cashback = `${((baseEffectivePrice * tier.cashbackPercent) / 100).toFixed(2)} BRL`;
        const points = Math.round(baseEffectivePrice * tier.pointsMultiplier);
        const effectiveDate = '2026-01-01T00:00:00Z/2026-12-31T23:59:59Z';
        const shippingLabel = tier.hasFreeShipping ? config.gmcShippingLabel : '';

        return `${config.gmcProgramLabel}:${tier.label}:${memberPrice}:${cashback}:${points}:${effectiveDate}:${shippingLabel}`;
      }).join(',');

      return [
        product.id,
        product.title.replace(/\t|\n/g, ' '),
        product.description.replace(/\t|\n/g, ' '),
        product.link,
        product.imageLink,
        product.availability,
        `${product.regularPrice.toFixed(2)} BRL`,
        product.salePrice ? `${product.salePrice.toFixed(2)} BRL` : '',
        product.brand,
        product.sku,
        product.gtin || '',
        loyaltyPrograms
      ].join('\t');
    });

    return [headers, ...rows].join('\n');
  }

  /**
   * Audits product data and loyalty attributes against Google's policies
   */
  public static auditFeedHealth(): {
    status: 'OPTIMAL' | 'WARNING' | 'ERROR';
    score: number;
    issues: Array<{ severity: 'HIGH' | 'MEDIUM' | 'INFO'; message: string; resolution: string }>;
    stats: {
      totalProducts: number;
      productsWithLoyalty: number;
      activeTiersCount: number;
      shippingLabelConfigured: boolean;
      landingPageReady: boolean;
    };
  } {
    const config = loyaltyStore.getConfig();
    const products = loyaltyStore.getAllProducts();
    const tiers = loyaltyStore.getTiers();

    const issues: Array<{ severity: 'HIGH' | 'MEDIUM' | 'INFO'; message: string; resolution: string }> = [];

    if (!config.gmcProgramLabel) {
      issues.push({
        severity: 'HIGH',
        message: 'Nome do Programa (program_label) não configurado.',
        resolution: 'Defina o program_label exatamente como cadastrado no Google Merchant Center.'
      });
    }

    if (!config.gmcShippingLabel) {
      issues.push({
        severity: 'MEDIUM',
        message: 'Rótulo de envio (shipping_label) vazio.',
        resolution: 'Configure shipping_label para ativar o benefício de Frete Grátis nas buscas do Google.'
      });
    }

    const productsMissingGtin = products.filter(p => !p.gtin);
    if (productsMissingGtin.length > 0) {
      issues.push({
        severity: 'INFO',
        message: `${productsMissingGtin.length} produtos sem GTIN (código de barras EAN-13).`,
        resolution: 'Adicione códigos GTIN para aumentar a taxa de correspondência do Google Shopping.'
      });
    }

    const score = Math.max(0, 100 - (issues.filter(i => i.severity === 'HIGH').length * 40) - (issues.filter(i => i.severity === 'MEDIUM').length * 20));

    return {
      status: score >= 90 ? 'OPTIMAL' : score >= 70 ? 'WARNING' : 'ERROR',
      score,
      issues,
      stats: {
        totalProducts: products.length,
        productsWithLoyalty: products.filter(p => p.loyaltyBenefitActive).length,
        activeTiersCount: tiers.length,
        shippingLabelConfigured: Boolean(config.gmcShippingLabel),
        landingPageReady: true
      }
    };
  }
}
