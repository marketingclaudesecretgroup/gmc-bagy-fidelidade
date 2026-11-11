'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
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
  ShieldAlert,
  ArrowRight,
  Shield,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'feed' | 'tiers' | 'members' | 'webhooks'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication & RBAC Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, router]);

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
    if (role === 'ADMIN') {
      fetchData();
    }
  }, [role]);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        <span>Verificando credenciais de acesso...</span>
      </div>
    );
  }

  // RBAC Access Barrier for Customers / Non-Admins
  if (user && role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-6 shadow-2xl bg-gradient-to-b from-amber-950/20 to-slate-900/60">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Acesso Restrito ao Lojista
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Área Exclusiva da Equipe Secret Outlet
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Você está autenticado como <strong>{user.name}</strong> ({user.email}), com perfil de <strong>Cliente Membro {user.tier || 'VIP'}</strong>.
              O painel de métricas financeiras, feeds GMC e webhooks é restrito à administração da loja.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/membro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Acessar Meu Portal de Vantagens
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/bagy-store-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-white/10 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Ir para Loja Secret Outlet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Painel de Controle Secret Outlet
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Auth
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              GMC ID: 118399377
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão do Clube Fidelidade Secret Outlet, sincronização oficial de feed do Google Merchant Center e integração Bagy.
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
