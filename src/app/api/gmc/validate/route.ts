import { NextResponse } from 'next/server';
import { GMCFeedGenerator } from '@/lib/services/gmc-feed-generator';
import { SchemaLdGenerator } from '@/lib/services/schema-ld-generator';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const audit = GMCFeedGenerator.auditFeedHealth();
  const programLd = SchemaLdGenerator.generateProgramStructuredData();
  const products = loyaltyStore.getAllProducts();
  const sampleProductLd = products.length > 0 ? SchemaLdGenerator.generateProductStructuredData(products[0]) : null;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    audit,
    schemaLd: {
      program: programLd,
      sampleProduct: sampleProductLd
    }
  });
}
