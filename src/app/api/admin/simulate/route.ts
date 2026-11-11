import { NextRequest, NextResponse } from 'next/server';
import { BagyClient } from '@/lib/services/bagy-client';
import { BagyWebhookPayload } from '@/lib/types/loyalty';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'order.paid', email, name, orderTotal = 250.00 } = body;

    const payload: BagyWebhookPayload = {
      event: action as any,
      timestamp: new Date().toISOString(),
      data: {
        id: `bagy_ord_${Date.now().toString(36).toUpperCase()}`,
        customer: {
          id: `bagy_cus_${Math.floor(1000 + Math.random() * 9000)}`,
          name: name || 'Cliente Teste Bagy',
          email: email || 'cliente.teste@bagy.com.br',
          phone: '(11) 99999-8888'
        },
        total: Number(orderTotal),
        subtotal: Number(orderTotal),
        status: action === 'order.paid' ? 'paid' : 'cancelled'
      }
    };

    const result = await BagyClient.processWebhook(payload);

    return NextResponse.json({
      success: true,
      simulationPayload: payload,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro na simulação' }, { status: 500 });
  }
}
