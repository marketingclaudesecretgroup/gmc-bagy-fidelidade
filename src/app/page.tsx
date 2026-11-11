import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Zap, Database, CheckCircle2, TrendingUp, Gift, ExternalLink, User, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 lg:p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Ecossistema Secret Outlet + Google Merchant Center (Conta 118399377)
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Clube Fidelidade Secret Outlet com{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Superpoderes do Google Shopping
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Plataforma ponta a ponta inspirada no <strong className="text-white">Fidelizar Mais</strong>, especializada no e-commerce da <strong className="text-white">Secret Outlet</strong> na Bagy com controle de acesso (RBAC), Portal do Membro, e suporte nativo às diretrizes oficiais do Google Merchant Center (<code className="text-xs bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">loyalty_program</code> e Frete Grátis exclusivo).
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/membro"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all text-sm sm:text-base group"
            >
              <User className="w-4 h-4" />
              Acessar Portal do Membro
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-purple-500/30 text-white font-semibold text-sm sm:text-base transition-all"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              Painel Admin (Lojista)
            </Link>

            <Link
              href="/bagy-store-demo"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Testar Loja Secret Outlet
            </Link>
          </div>
        </div>
      </div>

      {/* 2 Personas Distinction Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Persona 1: Admin */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-4 relative overflow-hidden bg-gradient-to-br from-purple-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Persona 1: Lojista / Admin
            </span>
            <Shield className="w-6 h-6 text-purple-400" />
          </div>

          <h3 className="text-xl font-bold text-white">Equipe Secret Outlet</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Área restrita para gestão financeira, feeds e regras do clube:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Dashboard financeiro, LTV (R$ 564 vs R$ 189) e ROI de Frete Grátis (689%).
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Gerenciador de Feeds XML e TSV sincronizados com o GMC Account 118399377.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Configuração de Níveis (Bronze, Prata, Ouro, VIP Black).
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              CRM de clientes, extrato global e disparador de Webhooks Bagy.
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Abrir Painel Administrativo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Persona 2: Client Member */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-4 relative overflow-hidden bg-gradient-to-br from-indigo-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Persona 2: Cliente Membro
            </span>
            <User className="w-6 h-6 text-indigo-400" />
          </div>

          <h3 className="text-xl font-bold text-white">Comprador da Secret Outlet</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Portal exclusivo em <code className="text-indigo-300 font-mono">/membro</code> sem acesso a dados de lojista:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Saldo de pontos atual e valor correspondente em R$ de desconto.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Barra de progresso visual mostrando quanto falta para o próximo nível.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Selo de Conta Google Vinculada para Frete Grátis no Google Shopping.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Resgate de cupons com 1-click e cópia automática para o checkout.
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/membro"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Abrir Portal do Membro <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Conformidade GMC & Bagy</h2>
            <p className="text-sm text-slate-400">Implementação de alta fidelidade das especificações oficiais do Google Merchant Center</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              GMC Account 118399377 Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Feed loyalty_program (XML / TSV)
            </div>
            <p className="text-xs text-slate-400">
              Inclui <code className="text-slate-300">program_label</code>, <code className="text-slate-300">tier_label</code>, <code className="text-slate-300">price</code>, <code className="text-slate-300">cashback_for_future_use</code>, <code className="text-slate-300">loyalty_points</code> e <code className="text-slate-300">shipping_label</code>.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Login com Conta Google & Vínculo
            </div>
            <p className="text-xs text-slate-400">
              Vínculo transparente com a Conta Google do cliente para ativar frete grátis e preços de membro na SERP.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Landing Page Exigida (/clube-fidelidade)
            </div>
            <p className="text-xs text-slate-400">
              Página pública com termos legais, níveis, benefícios e JSON-LD semântico Schema.org LoyaltyProgram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
