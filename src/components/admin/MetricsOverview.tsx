'use client';

import React from 'react';
import { MetricsSummary } from '@/lib/types/loyalty';
import { TrendingUp, Users, DollarSign, Truck, Award, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: MetricsSummary;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">LTV Médio (Membro vs Não)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">R$ {metrics.memberAvgLtvBrl.toFixed(2)}</span>
            <span className="text-xs text-emerald-400 flex items-center font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +198%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Não-membros possuem LTV de R$ {metrics.nonMemberAvgLtvBrl.toFixed(2)}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Taxa de Recompra Clube</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{metrics.memberRepurchaseRate}%</span>
            <span className="text-xs text-indigo-400 flex items-center font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +31.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Média loja geral: {metrics.nonMemberRepurchaseRate}%</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">ROI do Frete Grátis Fidelidade</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{metrics.freeShippingRoiPercent.toFixed(1)}%</span>
            <span className="text-xs text-blue-400 font-semibold">6.9x Retorno</span>
          </div>
          <p className="text-[11px] text-slate-500">R$ {metrics.freeShippingRevenueBrl.toLocaleString()} gerados c/ R$ {metrics.freeShippingCostBrl.toLocaleString()} de frete</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Impulsionamento GMC</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">+{metrics.gmcImpressionBoostPercent}%</span>
            <span className="text-xs text-purple-400 font-semibold">CTR +{metrics.gmcCtrBoostPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500">Benefícios de fidelidade destacados na SERP</p>
        </div>
      </div>

      {/* Secondary Economy Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400">Total de Membros Ativos</span>
          <div className="text-xl font-bold font-mono text-white">{metrics.activeMembers} clientes</div>
          <p className="text-[11px] text-emerald-400 font-mono">+{metrics.newMembersThisMonth} novos este mês</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400">Pontos Emitidos vs Resgatados</span>
          <div className="text-xl font-bold font-mono text-white">
            {metrics.totalPointsIssued.toLocaleString()} <span className="text-slate-500 text-sm font-normal">/ {metrics.totalPointsRedeemed.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-indigo-300 font-mono">Taxa de queima: {((metrics.totalPointsRedeemed / metrics.totalPointsIssued) * 100).toFixed(1)}%</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400">Passivo de Pontos em Aberto</span>
          <div className="text-xl font-bold font-mono text-white">R$ {metrics.pointsLiabilityBrl.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400">Provisão financeira para resgate de cupons Bagy</p>
        </div>
      </div>
    </div>
  );
}
