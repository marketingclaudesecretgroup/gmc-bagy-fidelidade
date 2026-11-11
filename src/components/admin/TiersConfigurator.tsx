'use client';

import React, { useState } from 'react';
import { LoyaltyTier } from '@/lib/types/loyalty';
import { ShieldCheck, Truck, Percent, Coins, Save } from 'lucide-react';

interface TiersConfiguratorProps {
  tiers: LoyaltyTier[];
}

export function TiersConfigurator({ tiers }: TiersConfiguratorProps) {
  const [tierList, setTierList] = useState<LoyaltyTier[]>(tiers);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleUpdateTier = (id: string, field: keyof LoyaltyTier, value: any) => {
    setTierList(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-400" />
            Configuração de Níveis & Benefícios do Google Shopping
          </h3>
          <p className="text-xs text-slate-400">
            Ajuste as regras de pontuação, descontos exclusivos e políticas de frete grátis refletidas no feed GMC.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          {savedSuccess ? 'Salvo no Feed!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tierList.map(tier => (
          <div key={tier.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${tier.badgeBg}`}>
                Nível {tier.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">tier_label: {tier.label}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Pontos para Qualificação:</label>
                <input
                  type="number"
                  value={tier.minPointsToQualify}
                  onChange={(e) => handleUpdateTier(tier.id, 'minPointsToQualify', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Multiplicador (pts/R$):</label>
                <input
                  type="number"
                  step="0.1"
                  value={tier.pointsMultiplier}
                  onChange={(e) => handleUpdateTier(tier.id, 'pointsMultiplier', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Desconto Membro (%):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tier.memberDiscountPercent}
                    onChange={(e) => handleUpdateTier(tier.id, 'memberDiscountPercent', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono pr-8"
                  />
                  <span className="absolute right-2.5 top-1.5 text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cashback (%):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tier.cashbackPercent}
                    onChange={(e) => handleUpdateTier(tier.id, 'cashbackPercent', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono pr-8"
                  />
                  <span className="absolute right-2.5 top-1.5 text-slate-400">%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={tier.hasFreeShipping}
                    onChange={(e) => handleUpdateTier(tier.id, 'hasFreeShipping', e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Frete Grátis Exclusivo</span>
                </label>

                {tier.hasFreeShipping && (
                  <div>
                    <label className="text-slate-400 block mb-1">Gasto Mínimo Frete Grátis (R$):</label>
                    <input
                      type="number"
                      value={tier.freeShippingMinSpend}
                      onChange={(e) => handleUpdateTier(tier.id, 'freeShippingMinSpend', Number(e.target.value))}
                      placeholder="0 para ilimitado"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">0 = sem valor mínimo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
