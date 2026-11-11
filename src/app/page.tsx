import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Percent,
  CheckCircle2,
  Gift,
  ExternalLink,
  User,
  ShoppingBag,
  Star
} from 'lucide-react';
import { loyaltyStore } from '@/lib/services/loyalty-store';

export default function HomePage() {
  const products = loyaltyStore.getAllProducts();
  const tiers = loyaltyStore.getTiers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 lg:p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Clube de Vantagens Oficial • Secret Outlet
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Ganhe Pontos, Cashback e{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Frete Grátis no Google Shopping
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Bem-vindo ao programa oficial de fidelidade da <strong className="text-white">Secret Outlet</strong>. 
            Ao conectar sua Conta Google ou e-mail, cada compra de marcas como Lacoste, Reserva, Tommy Hilfiger e Aramis acumula pontos que viram descontos imediatos, além de desbloquear frete grátis exclusivo nas suas buscas no Google.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all text-sm sm:text-base group"
            >
              <User className="w-4 h-4" />
              Entrar ou Criar Conta (+100 pts)
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/clube-fidelidade"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-slate-200 font-semibold text-sm sm:text-base transition-all"
            >
              Ver Tabela de Benefícios
            </Link>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100 Pontos de Boas-vindas no cadastro</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Frete Grátis exclusivo nos anúncios do Google</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Percent className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Até 18% OFF e 12% de Cashback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products with Member Perks (Real Secret Outlet Catalog) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              Catálogo com Benefícios de Membro
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Preços Especiais para Membros do Clube
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Produtos originais com desconto exclusivo de membro e pontuação multiplicada
            </p>
          </div>

          <a
            href="https://www.secretoutlet.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            Ver todos no site da Secret Outlet
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => {
            const memberDiscountFactor = 0.82; // VIP tier 18% off
            const memberPrice = (product.salePrice ?? product.regularPrice) * memberDiscountFactor;
            const pointsEarned = Math.round((product.salePrice ?? product.regularPrice) * 2.5);

            return (
              <div
                key={product.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-indigo-500/40 transition-all shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={product.imageLink}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-purple-600/90 text-white backdrop-blur-md shadow-md">
                      VIP: R$ {memberPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                      <Truck className="w-2.5 h-2.5" /> Frete Grátis
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">{product.brand}</span>
                    <h3 className="text-xs font-semibold text-white line-clamp-2 mt-0.5 leading-snug">
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-white">
                        R$ {(product.salePrice ?? product.regularPrice).toFixed(2)}
                      </span>
                      {product.salePrice && (
                        <span className="text-[11px] text-slate-500 line-through">
                          R$ {product.regularPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="text-emerald-400 font-medium">+{pointsEarned} pontos</span>
                      <span className="font-mono text-slate-500">SKU {product.sku}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono uppercase">
            <Star className="w-3.5 h-3.5" />
            Estrutura de Níveis
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Evolua no Clube a Cada Compra
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Quanto mais você compra na Secret Outlet, mais vantagens e descontos são liberados
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`glass-card p-6 rounded-2xl border ${tier.badgeBorder} space-y-4 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase ${tier.badgeBg}`}>
                    {tier.name}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {tier.minPointsToQualify === 0 ? 'Adesão Gratuita' : `${tier.minPointsToQualify} pts`}
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {tier.memberDiscountPercent}% OFF
                  </div>
                  <div className="text-xs text-slate-400">Desconto exclusivo em produtos selecionados</div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>
                      {tier.hasFreeShipping
                        ? tier.freeShippingMinSpend === 0
                          ? 'Frete Grátis SEM MÍNIMO'
                          : `Frete Grátis acima de R$ ${tier.freeShippingMinSpend}`
                        : 'Frete padrão da loja'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>{tier.cashbackPercent}% de Cashback acumulado</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{tier.pointsMultiplier}x pontos por real gasto</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  Fazer Parte do Clube
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pronto para economizar na sua próxima compra?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Conecte sua conta em menos de 1 minuto e ganhe 100 pontos de bônus imediatos para resgatar em cupons.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all text-sm"
          >
            Cadastrar Gratuitamente no Clube
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
