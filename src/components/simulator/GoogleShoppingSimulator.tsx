'use client';

import React, { useState } from 'react';
import { ProductCatalogItem } from '@/lib/types/loyalty';
import { Truck, CheckCircle2, Shield, Eye, Info, Sparkles, ExternalLink } from 'lucide-react';

interface GoogleShoppingSimulatorProps {
  products: ProductCatalogItem[];
}

export function GoogleShoppingSimulator({ products }: GoogleShoppingSimulatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem>(products[0]);
  const [selectedTier, setSelectedTier] = useState<'BRONZE' | 'PRATA' | 'OURO' | 'VIP'>('VIP');
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState<boolean>(true);

  // Sync selectedProduct whenever products list changes
  React.useEffect(() => {
    if (products && products.length > 0) {
      const exists = products.find(p => p.id === selectedProduct?.id);
      if (!exists) {
        setSelectedProduct(products[0]);
      }
    }
  }, [products, selectedProduct?.id]);

  if (!selectedProduct) return null;

  const basePrice = selectedProduct.salePrice ?? selectedProduct.regularPrice;
  const discountPct = selectedTier === 'VIP' ? 18 : selectedTier === 'OURO' ? 12 : selectedTier === 'PRATA' ? 8 : 5;
  const memberPrice = basePrice * (1 - discountPct / 100);
  const cashbackVal = (basePrice * (selectedTier === 'VIP' ? 0.12 : 0.05)).toFixed(2);
  const loyaltyPoints = Math.round(basePrice * (selectedTier === 'VIP' ? 2.5 : 1));

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-google-blue" />
              Simulador Visual do Google Shopping
            </h3>
            <p className="text-xs text-slate-400">
              Veja exatamente como o seu anúncio e listagem gratuita aparecem na Pesquisa Google e Google Shopping com os atributos <code className="text-indigo-300 font-mono">loyalty_program</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={isGoogleLoggedIn}
                onChange={(e) => setIsGoogleLoggedIn(e.target.checked)}
                className="rounded accent-google-blue cursor-pointer"
              />
              <span className="font-medium text-white">Usuário logado na Conta Google</span>
            </label>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="BRONZE">Nível Bronze (5% OFF)</option>
              <option value="PRATA">Nível Prata (8% OFF + Frete)</option>
              <option value="OURO">Nível Ouro (12% OFF + Frete)</option>
              <option value="VIP">Nível VIP Black (18% OFF + Frete Ilimitado)</option>
            </select>
          </div>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Produto:</span>
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors truncate max-w-xs ${
                selectedProduct.id === p.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator SERP Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Shopping Desktop Grid Card Simulation */}
        <div className="rounded-2xl bg-[#202124] border border-[#3c4043] p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#3c4043] pb-3">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-blue-400 font-bold">G</span>
              <span className="text-red-400 font-bold">o</span>
              <span className="text-yellow-400 font-bold">o</span>
              <span className="text-blue-400 font-bold">g</span>
              <span className="text-green-400 font-bold">l</span>
              <span className="text-red-400 font-bold">e</span>
              <span className="ml-1 text-slate-300">Shopping</span>
            </div>
            <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
              {isGoogleLoggedIn ? '✓ Benefícios de Fidelidade Reconhecidos' : 'Visualização Genérica'}
            </span>
          </div>

          <div className="max-w-xs mx-auto bg-[#303134] rounded-xl overflow-hidden border border-[#3c4043] p-3 space-y-3 shadow-lg">
            {/* Product Image */}
            <div className="relative aspect-square bg-[#202124] rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selectedProduct.id}
                src={selectedProduct.imageLink}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-200"
              />
              {isGoogleLoggedIn && (
                <div className="absolute top-2 left-2 bg-[#1e8e3e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Preço p/ membros
                </div>
              )}
            </div>

            {/* Merchant info & title */}
            <div className="space-y-1">
              <div className="text-[11px] text-[#9aa0a6] font-medium flex items-center justify-between">
                <span className="text-white font-semibold flex items-center gap-1">
                  Secret Outlet
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">GMC 118399377</span>
                </span>
                <span className="flex items-center gap-0.5 text-amber-400 font-bold">★ 4.9 (420)</span>
              </div>
              <h4 className="text-xs font-medium text-[#e8eaed] line-clamp-2 leading-snug">
                {selectedProduct.title}
              </h4>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1 pt-1 border-t border-[#3c4043]">
              {isGoogleLoggedIn ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-white">
                      R$ {memberPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#9aa0a6] line-through">
                      R$ {selectedProduct.regularPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#81c995] font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Frete grátis com Clube Fidelidade
                  </div>
                  <div className="text-[10px] text-[#8ab4f8]">
                    Ganhe {loyaltyPoints} pts ({selectedTier}) + R$ {cashbackVal} cashback
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base font-bold text-white">
                    R$ {basePrice.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-[#9aa0a6]">
                    + R$ 25,00 frete padrão
                  </div>
                  <div className="text-[10px] text-indigo-300 underline cursor-pointer">
                    Membros do clube pagam R$ {memberPrice.toFixed(2)} com frete grátis
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Google Merchant Center Inspection */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Diagnóstico de Atributos do Google Feed
            </h4>
            <span className="text-xs font-mono text-emerald-400">g:loyalty_program</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:program_label</span>
              <span className="font-mono text-white">Clube Fidelidade Secret Outlet</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:tier_label</span>
              <span className="font-mono text-indigo-300 font-bold">{selectedTier}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:price</span>
              <span className="font-mono text-emerald-400 font-bold">{memberPrice.toFixed(2)} BRL</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:cashback_for_future_use</span>
              <span className="font-mono text-white">{cashbackVal} BRL</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:loyalty_points</span>
              <span className="font-mono text-white">{loyaltyPoints}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400 font-mono">g:shipping_label</span>
              <span className="font-mono text-blue-300 font-semibold">loyalty_free_shipping</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 font-mono">g:member_price_effective_date</span>
              <span className="font-mono text-slate-300 text-[11px]">2026-01-01T00:00:00Z/2026-12-31T23:59:59Z</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Vantagem Competitiva:</strong> O selo verde "Preço p/ membros" eleva a taxa de clique (CTR) em até 24.5% no leilão do Google Shopping sem canibalizar margem de clientes casuais.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
