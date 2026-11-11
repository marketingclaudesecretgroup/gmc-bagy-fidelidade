import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Zap, Database, CheckCircle2, TrendingUp, Gift, ExternalLink } from 'lucide-react';

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
            Ecossistema Completo de Fidelidade Bagy + Google Merchant Center
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Fidelidade Inteligente para Bagy com{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Superpoderes do Google Shopping
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Plataforma ponta a ponta inspirada no <strong className="text-white">Fidelizar Mais</strong>, especializada em e-commerce Bagy com suporte nativo às diretrizes oficiais do Google Merchant Center (<code className="text-xs bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">loyalty_program</code>, Frete Grátis exclusivo para membros e Schema.org).
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all text-sm sm:text-base group"
            >
              Acessar Painel Administrativo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/bagy-store-demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-white font-semibold text-sm sm:text-base transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Testar Loja Bagy + Widget
            </Link>

            <Link
              href="/clube-fidelidade"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Ver Landing Page Google
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Google Merchant Center</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Feeds XML & TSV com suporte aos atributos oficiais <code className="text-[11px] bg-slate-800 text-blue-300 px-1 rounded">loyalty_program</code>, preços especiais para membros e frete grátis na Busca do Google.
          </p>
          <div className="pt-2">
            <a
              href="/api/gmc/feed.xml"
              target="_blank"
              className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
            >
              /api/gmc/feed.xml <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Webhooks & API Bagy</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sincronização em tempo real de pedidos pagos, novos clientes, crédito de pontos por real gasto e geração automática de cupons na API da Bagy.
          </p>
          <div className="pt-2">
            <span className="text-xs text-purple-400 font-mono flex items-center gap-1">
              POST /api/webhooks/bagy
            </span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Widget Flutuante Bagy</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Script JS isolado com Shadow DOM para injetar em qualquer loja Bagy. Exibe extrato, níveis Bronze/Prata/Ouro/VIP e resgate de cupom 1-click.
          </p>
          <div className="pt-2">
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              public/widget/bagy-loyalty.js
            </span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">ROI & Métricas de LTV</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Dashboard financeiro com cálculo de LTV de membros (R$ 564 vs R$ 189), taxa de recompra de 46.4% e ROI de 689% no benefício de frete grátis.
          </p>
          <div className="pt-2">
            <Link href="/admin" className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
              Abrir Dashboard <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Conformidade com Diretrizes Oficiais Google</h2>
            <p className="text-sm text-slate-400">Resumo de implementação dos requisitos do Google Merchant Center para programas de fidelidade</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Homologado
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
              Frete Grátis p/ Membros Logados
            </div>
            <p className="text-xs text-slate-400">
              Associação direta com o serviço de frete do Merchant Center via rótulo de envio e sincronização da Conta Google do cliente.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Landing Page Exigida (/clube-fidelidade)
            </div>
            <p className="text-xs text-slate-400">
              Página pública indexável com regras de qualificação de níveis, benefícios transparentes, política de frete e termos oficiais.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Schema.org LoyaltyProgram JSON-LD
            </div>
            <p className="text-xs text-slate-400">
              Marcação semântica estruturada com <code className="text-slate-300">LoyaltyProgramTier</code> e <code className="text-slate-300">TierBenefit</code> para Rich Snippets na busca orgânica.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bagy Coupons API Engine
            </div>
            <p className="text-xs text-slate-400">
              Geração de códigos de cupom dinâmicos com expiração e valor mínimo para resgate direto no carrinho da loja Bagy.
            </p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Simulador Visual Google Shopping
            </div>
            <p className="text-xs text-slate-400">
              Pré-visualização realista de como os produtos da loja aparecem nos resultados de busca com os selos exclusivos de membro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
