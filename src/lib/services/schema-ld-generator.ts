import { loyaltyStore } from './loyalty-store';
import { ProductCatalogItem } from '../types/loyalty';

export class SchemaLdGenerator {
  /**
   * Generates Schema.org JSON-LD for the public Loyalty Program Landing Page
   * Conforms to Schema.org LoyaltyProgram specification
   */
  public static generateProgramStructuredData(): object {
    const config = loyaltyStore.getConfig();
    const tiers = loyaltyStore.getTiers();

    return {
      '@context': 'https://schema.org',
      '@type': 'LoyaltyProgram',
      name: config.programName,
      description: 'Programa oficial de fidelidade e recompensas da Aura Store Bagy com benefícios exclusivos no Google Shopping, descontos especiais e frete grátis para membros.',
      provider: {
        '@type': 'Organization',
        name: config.storeName,
        url: config.storeUrl
      },
      hasTier: tiers.map(tier => ({
        '@type': 'LoyaltyProgramTier',
        name: tier.name,
        identifier: tier.label,
        description: tier.description,
        membershipRequirement: {
          '@type': 'QualitativeValue',
          name: `Acúmulo de pelo menos ${tier.minPointsToQualify} pontos em compras anteriores.`
        },
        hasTierBenefit: [
          {
            '@type': 'TierBenefit',
            name: `${tier.memberDiscountPercent}% OFF em produtos selecionados`,
            description: `Desconto direto para membros nível ${tier.name}`
          },
          ...(tier.hasFreeShipping ? [{
            '@type': 'TierBenefit',
            name: 'Frete Grátis Exclusivo',
            description: tier.freeShippingMinSpend === 0
              ? 'Frete grátis ilimitado sem valor mínimo de pedido'
              : `Frete grátis para pedidos acima de R$ ${tier.freeShippingMinSpend.toFixed(2)}`
          }] : []),
          {
            '@type': 'TierBenefit',
            name: `${tier.cashbackPercent}% Cashback`,
            description: 'Cashback creditado para uso em pedidos futuros'
          }
        ]
      }))
    };
  }

  /**
   * Generates Schema.org JSON-LD for Product Pages including Member Pricing Offers
   */
  public static generateProductStructuredData(product: ProductCatalogItem): object {
    const config = loyaltyStore.getConfig();
    const tiers = loyaltyStore.getTiers();
    const baseEffectivePrice = product.salePrice ?? product.regularPrice;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: [product.imageLink],
      sku: product.sku,
      ...(product.gtin ? { gtin13: product.gtin } : {}),
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: (baseEffectivePrice * 0.82).toFixed(2), // VIP member price
        highPrice: product.regularPrice.toFixed(2),
        offerCount: tiers.length + 1,
        offers: [
          // Standard public offer
          {
            '@type': 'Offer',
            name: 'Preço Regular Não-Membro',
            price: baseEffectivePrice.toFixed(2),
            priceCurrency: 'BRL',
            availability: product.availability === 'in_stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: product.link
          },
          // Loyalty Member tiers offers
          ...tiers.map(tier => {
            const discountFactor = (100 - tier.memberDiscountPercent) / 100;
            const memberPrice = (baseEffectivePrice * discountFactor).toFixed(2);

            return {
              '@type': 'Offer',
              name: `Preço Membro ${tier.name}`,
              price: memberPrice,
              priceCurrency: 'BRL',
              eligibleCustomerType: {
                '@type': 'CustomerType',
                name: `LoyaltyMember_${tier.label}`
              },
              priceSpecification: {
                '@type': 'LoyaltyPointsSpecification',
                eligibleQuantity: {
                  '@type': 'QuantitativeValue',
                  value: 1
                }
              },
              availability: 'https://schema.org/InStock',
              url: product.link
            };
          })
        ]
      }
    };
  }
}
