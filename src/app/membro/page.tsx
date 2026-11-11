'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Coins, 
  Truck, 
  Gift, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Tag, 
  ShoppingBag,
  ExternalLink,
  Percent,
  Clock,
  Award,
  User,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import CustomerProfileForm from '@/components/loyalty/CustomerProfileForm';

export default function MembroPortalPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [memberData, setMemberData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');

  // Authentication Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/membro');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadMemberDetails = async () => {
    if (!user?.email) return;
    setLoadingData(true);
    try {
      const res = await fetch(`/api/loyalty/member?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success) {
        setMemberData(data);
      }
    } catch (e) {
      console.error('Falha ao buscar dados do membro:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadMemberDetails();
    }
  }, [user?.email]);

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = async (value: number, pointsSpent: number, minSpend: number) => {
    if (!user?.email) return;

    if ((memberData?.member?.pointsBalance || 0) < pointsSpent) {
      setFeedbackMsg({
        type: 'error',
        text: `Saldo insuficiente. Você tem ${memberData?.member?.pointsBalance} pontos e precisa de ${pointsSpent} pontos.`
      });
      return;
    }

    setRedeeming(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          value,
          pointsSpent,
          minSpend
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({
          type: 'success',
          text: `Cupom ${data.coupon.code} criado com sucesso! Código copiado.`
        });
        copyCouponCode(data.coupon.code);
        await loadMemberDetails();
        await refreshUser();
      } else {
        setFeedbackMsg({
          type: 'error',
          text: data.error || 'Falha ao resgatar pontos'
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: 'Erro de comunicação ao resgatar pontos'
      });
    } finally {
      setRedeeming(false);
    }
  };

  const handleProfileUpdated = async (updatedMember: any, bonusAwarded: boolean) => {
    await loadMemberDetails();
    await refreshUser();
    if (bonusAwarded) {
      setFeedbackMsg({
        type: 'success',
        text: '🎉 Parabéns! Você completou seu perfil e ganhou +150 pontos no Clube Fidelidade Secret Outlet!'
      });
    }
  };

  if (isLoading || (!memberData && loadingData)) {
    return (
      <div className="py-24 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        <span>Carregando seu portal de vantagens...</span>
      </div>
    );
  }

  const member = memberData?.member || user;
  const currentTier = memberData?.currentTier;
  const nextTier = memberData?.nextTier;
  const pointsToNext = memberData?.pointsToNextTier || 0;
  const coupons = memberData?.coupons || [];
  const transactions = memberData?.transactions || [];

  const isProfileCompleted = Boolean(member?.profile?.profileCompleted);
  const pointsValueInBrl = ((member?.pointsBalance || 0) * 0.05).toFixed(2);

  // Spend progress
  const currentSpend = member?.totalSpendBrl || 0;
  const targetSpend = nextTier ? nextTier.minPointsToQualify : 3500;
  const progressPercent = Math.min(100, Math.round((currentSpend / targetSpend) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Welcome Header */}
      <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              member.tier === 'VIP' ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm' :
              member.tier === 'OURO' ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/40' :
              member.tier === 'PRATA' ? 'bg-slate-800 text-slate-200 border border-slate-600' :
              'bg-amber-950/80 text-amber-300 border border-amber-600'
            }`}>
              Nível {member.tier || 'BRONZE'}
            </span>
            <span className="text-xs text-slate-400">| Cliente Secret Outlet</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Olá, {member.name || 'Cliente'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Acompanhe seu saldo de pontos, resgate cupons para usar na Secret Outlet e aproveite benefícios exclusivos no Google Shopping.
          </p>
        </div>

        {/* Google Shopping Account Badge */}
        <div className="bg-slate-900/80 border border-blue-500/30 p-4 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Conta Google Vinculada
            </div>
            <div className="text-[11px] text-slate-400">
              Frete Grátis e Preços VIP ativos na Busca do Google
            </div>
          </div>
        </div>
      </div>

      {/* Profile Incomplete Notification Banner */}
      {!isProfileCompleted && (
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-emerald-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Complete seu Perfil Brasil</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  +150 Pontos de Bônus
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Preencha seu CPF e endereço para emissão de Nota Fiscal e ativação imediata do Frete Grátis exclusivo nos pedidos da Secret Outlet.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/25"
          >
            <span>Preencher Agora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tab Switcher: Overview vs Brazilian Profile */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Visão Geral & Extrato</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Meu Perfil Brasil 🇧🇷</span>
          {isProfileCompleted ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Completo
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              +150 pts
            </span>
          )}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <CustomerProfileForm
          initialProfile={member.profile}
          userEmail={user?.email || member.email}
          userName={member.name}
          onProfileUpdated={handleProfileUpdated}
        />
      ) : (
        <>
      {/* Primary Status Grid: Balance + Tier Progress + Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Card */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4 flex flex-col justify-between bg-gradient-to-br from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Saldo Disponível
            </span>
            <Coins className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {(member.pointsBalance || 0).toLocaleString()} <span className="text-lg font-normal text-emerald-400">pts</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Equivale a <strong className="text-emerald-400 font-mono">R$ {pointsValueInBrl}</strong> de desconto no checkout da Secret Outlet.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Total já acumulado:</span>
            <span className="font-mono text-white font-semibold">{(member.totalPointsEarned || 0).toLocaleString()} pts</span>
          </div>
        </div>

        {/* Tier Progress Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Evolução de Nível
            </span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-white font-semibold">Nível Atual: {member.tier}</span>
              {nextTier ? (
                <span className="text-slate-400">Próximo: <strong className="text-indigo-300">{nextTier.name}</strong></span>
              ) : (
                <span className="text-purple-300 font-bold">Nível Máximo Alcançado!</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Gasto acumulado: R$ {(member.totalSpendBrl || 0).toFixed(2)}</span>
              {nextTier && (
                <span>Meta: R$ {nextTier.minPointsToQualify.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-xs text-slate-400">
            {nextTier ? (
              <span>Faltam apenas <strong>R$ {Math.max(0, targetSpend - currentSpend).toFixed(2)}</strong> em compras para desbloquear <strong>{nextTier.memberDiscountPercent}% OFF</strong> e novos privilégios!</span>
            ) : (
              <span className="text-purple-300">Você desfruta de 18% OFF e Frete Grátis Ilimitado em toda a loja.</span>
            )}
          </div>
        </div>

        {/* Active Perks Summary */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Benefícios Ativos
            </span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>

          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multiplicador de pontos: <strong className="text-white font-mono">{currentTier?.pointsMultiplier || 1.0}x pts/R$</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Desconto de membro: <strong className="text-white font-mono">{currentTier?.memberDiscountPercent || 5}% OFF</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cashback para futuras compras: <strong className="text-white font-mono">{currentTier?.cashbackPercent || 3}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Frete Grátis Clube: <strong className="text-emerald-400">{currentTier?.hasFreeShipping ? 'Ativo' : 'A partir de R$ 199'}</strong></span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/bagy-store-demo"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
              Ir para a Loja Secret Outlet
            </Link>
          </div>
        </div>
      </div>

      {/* Rewards Catalog (Resgatar Cupons) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-400" />
              Resgatar Cupons de Desconto
            </h2>
            <p className="text-xs text-slate-400">
              Troque seus pontos acumulados por cupons gerados diretamente na API da Secret Outlet.
            </p>
          </div>

          {feedbackMsg && (
            <div className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-950/80 text-red-300 border border-red-500/30'
            }`}>
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-red-400" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Reward 15 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                300 Pontos
              </span>
              <Tag className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <div className="text-2xl font-black text-white">R$ 15,00 OFF</div>
              <p className="text-xs text-slate-400">Para compras acima de R$ 60,00</p>
            </div>

            <button
              onClick={() => handleRedeem(15, 300, 60)}
              disabled={redeeming || (member.pointsBalance || 0) < 300}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              {redeeming ? 'Processando...' : 'Resgatar Cupom'}
            </button>
          </div>

          {/* Reward 30 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-lg">
                600 Pontos
              </span>
              <Tag className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <div className="text-2xl font-black text-white">R$ 30,00 OFF</div>
              <p className="text-xs text-slate-400">Para compras acima de R$ 120,00</p>
            </div>

            <button
              onClick={() => handleRedeem(30, 600, 120)}
              disabled={redeeming || (member.pointsBalance || 0) < 600}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              {redeeming ? 'Processando...' : 'Resgatar Cupom'}
            </button>
          </div>

          {/* Reward 50 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                1000 Pontos
              </span>
              <Tag className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <div className="text-2xl font-black text-white">R$ 50,00 OFF</div>
              <p className="text-xs text-slate-400">Para compras acima de R$ 180,00</p>
            </div>

            <button
              onClick={() => handleRedeem(50, 1000, 180)}
              disabled={redeeming || (member.pointsBalance || 0) < 1000}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20"
            >
              {redeeming ? 'Processando...' : 'Resgatar Cupom'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Coupons & Transactions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Coupons */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              Seus Cupons Secret Outlet ({coupons.length})
            </h3>
            <span className="text-[11px] text-slate-400">Clique para copiar</span>
          </div>

          {coupons.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Você ainda não gerou nenhum cupom. Resgate seus pontos acima!
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon: any) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-indigo-300">
                        {coupon.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        coupon.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {coupon.status === 'ACTIVE' ? 'Pronto p/ Usar' : 'Utilizado'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      R$ {coupon.value.toFixed(2)} OFF (Mínimo: R$ {coupon.minCartValue.toFixed(2)})
                    </div>
                  </div>

                  <button
                    onClick={() => copyCouponCode(coupon.code)}
                    className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs flex items-center gap-1 transition-colors"
                    title="Copiar cupom"
                  >
                    {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === coupon.code ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction History Statement */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Extrato Detalhado de Pontos
            </h3>
            <span className="text-[11px] text-slate-400">Últimas movimentações</span>
          </div>

          {transactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Nenhuma movimentação registrada até o momento.
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-white font-medium">{tx.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('pt-BR')} às {new Date(tx.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <span className={`font-mono font-bold ${
                    tx.points > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secret Outlet Extra Missions */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Missões para Ganhar Pontos Extras
        </h3>
        <p className="text-xs text-slate-400">Acelere sua subida de nível completando ações simples no ecossistema Secret Outlet</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Mission 1 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Vincular Conta Google</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Concluído</span>
            </div>
            <p className="text-xs text-slate-400">Garante frete grátis e visualização de vantagens nas buscas.</p>
          </div>

          {/* Mission 2: Perfil Brasil */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Completar Perfil Brasil</span>
              {isProfileCompleted ? (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Concluído</span>
              ) : (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  +150 pts
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isProfileCompleted 
                ? 'Dados cadastrais e endereço salvos com sucesso.'
                : 'Cadastre CPF e endereço para emissão de NF e frete.'}
            </p>
          </div>

          {/* Mission 3 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Avaliar Produto Adquirido</span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">+50 pts</span>
            </div>
            <p className="text-xs text-slate-400">Deixe um review sincero com foto na loja após receber sua encomenda.</p>
          </div>

          {/* Mission 4 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Aniversário do Membro</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">+200 pts</span>
            </div>
            <p className="text-xs text-slate-400">Receba pontuação e cupom especial no primeiro dia do mês de aniversário.</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
