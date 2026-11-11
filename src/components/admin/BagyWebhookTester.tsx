'use client';

import React, { useState } from 'react';
import { Send, Zap, CheckCircle2, AlertCircle, RefreshCw, Key, Shield, ArrowRight } from 'lucide-react';

interface BagyWebhookTesterProps {
  onEventSimulated?: () => void;
}

export function BagyWebhookTester({ onEventSimulated }: BagyWebhookTesterProps) {
  const [eventType, setEventType] = useState<'order.paid' | 'order.cancelled' | 'customer.created'>('order.paid');
  const [customerEmail, setCustomerEmail] = useState<string>('carolina.mendes@gmail.com');
  const [customerName, setCustomerName] = useState<string>('Carolina Mendes Ramos');
  const [orderTotal, setOrderTotal] = useState<number>(380.00);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: eventType,
          email: customerEmail,
          name: customerName,
          orderTotal
        })
      });

      const data = await res.json();
      setResult(data);
      if (onEventSimulated) onEventSimulated();
    } catch (err: any) {
      setResult({ error: err.message || 'Falha ao simular evento' });
    } finally {
      setLoading(false);
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const webhookUrl = `${origin}/api/webhooks/bagy`;

  return (
    <div className="space-y-6">
      {/* Credentials and Settings Box */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Integração Nativa Bagy (Locaweb Company)
            </h3>
            <p className="text-xs text-slate-400">
              Configure estas credenciais no painel da sua loja Bagy em <em>Configurações &gt; Integrações &gt; Webhooks</em>.
            </p>
          </div>
          <span className="text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full">
            API v2 Conectada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400">URL do Webhook Bagy:</span>
            <div className="font-mono text-emerald-400 truncate">{webhookUrl}</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400">Bagy Store ID:</span>
            <div className="font-mono text-white">bagy_str_994208</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-slate-400">Assinatura HMAC:</span>
            <div className="font-mono text-indigo-300 truncate">whsec_98fba671b402e1c...</div>
          </div>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            Simulador Interativo de Webhooks da Bagy
          </h4>
          <p className="text-xs text-slate-400">
            Dispare eventos simulados da Bagy para verificar o crédito imediato de pontos, cálculos de multiplicadores de nível e promoções para membros.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Evento do Webhook:</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="order.paid">order.paid (Pedido Pago)</option>
              <option value="customer.created">customer.created (Novo Cadastro)</option>
              <option value="order.cancelled">order.cancelled (Cancelamento/Estorno)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Nome do Cliente:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">E-mail do Cliente:</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Valor do Pedido (R$):</label>
            <input
              type="number"
              value={orderTotal}
              onChange={(e) => setOrderTotal(Number(e.target.value))}
              disabled={eventType === 'customer.created'}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-40"
            />
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/25 flex items-center gap-2"
        >
          <Send className={`w-3.5 h-3.5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Disparando Webhook...' : 'Disparar Webhook de Teste'}
        </button>

        {/* Result Feedback */}
        {result && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              {result.result?.message || result.error || 'Webhook processado com sucesso'}
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 border border-white/5">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
