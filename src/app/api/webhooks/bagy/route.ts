import { NextRequest, NextResponse } from 'next/server';
import { BagyClient } from '@/lib/services/bagy-client';
import { BagyWebhookPayload } from '@/lib/types/loyalty';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-bagy-hmac-sha256') || undefined;

    // Verify webhook authenticity
    const isValid = BagyClient.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Assinatura HMAC inválida' }, { status: 401 });
    }

    const payload: BagyWebhookPayload = JSON.parse(rawBody);
    const result = await BagyClient.processWebhook(payload);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao processar webhook da Bagy:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao processar webhook' }, { status: 500 });
  }
}
