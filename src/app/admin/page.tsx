'use client';

import React, { useState, useEffect } from 'react';
import { MetricsOverview } from '@/components/admin/MetricsOverview';
import { GoogleShoppingSimulator } from '@/components/simulator/GoogleShoppingSimulator';
import { FeedManager } from '@/components/admin/FeedManager';
import { TiersConfigurator } from '@/components/admin/TiersConfigurator';
import { MembersTable } from '@/components/admin/MembersTable';
import { BagyWebhookTester } from '@/components/admin/BagyWebhookTester';
import { 
  TrendingUp, 
  Sparkles, 
  FileCode, 
  Coins, 
  Users, 
  Zap, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'feed' | 'tiers' | 'members' | 'webhooks'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Falha ao carregar métricas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Painel de Controle de Fidelidade Bagy
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              GMC Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão unificada do programa de recompensas, sincronização de feed do Google Shopping e integração Bagy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Recarregar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="/clube-fidelidade"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md shadow-indigo-600/20"
          >
            Landing Page GMC
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Visão Geral & LTV
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'simulator'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Simulador Google Shopping
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'feed'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Feeds GMC & Auditoria
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'tiers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coins className="w-4 h-4" />
          Configuração de Níveis
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'members'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          Membros & Cupons
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors shrink-0 ${
            activeTab === 'webhooks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4" />
          Bagy Webhook Tester
        </button>
      </div>

      {/* Content Rendering */}
      {loading && !data ? (
        <div className="py-20 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Carregando dados da plataforma...</span>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && data && (
            <MetricsOverview metrics={data.metrics} />
          )}

          {activeTab === 'simulator' && data && (
            <GoogleShoppingSimulator products={data.products} />
          )}

          {activeTab === 'feed' && (
            <FeedManager />
          )}

          {activeTab === 'tiers' && data && (
            <TiersConfigurator tiers={data.tiers} />
          )}

          {activeTab === 'members' && data && (
            <MembersTable members={data.recentMembers} coupons={data.recentCoupons} />
          )}

          {activeTab === 'webhooks' && (
            <BagyWebhookTester onEventSimulated={fetchData} />
          )}
        </div>
      )}
    </div>
  );
}
