'use client';

import React, { useState } from 'react';
import { SchemaLdGenerator } from '@/lib/services/schema-ld-generator';
import { DEFAULT_TIERS, DEFAULT_CONFIG } from '@/lib/services/loyalty-store';
import { 
  Sparkles, 
  Check, 
  Truck, 
  Percent, 
  Coins, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ShieldCheck, 
  Calculator,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ClubeFidelidadePage() {
  const [calcSpend, setCalcSpend] = useState<number>(350);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const structuredData = SchemaLdGenerator.generateProgramStructuredData();

  const faqs = [
    {
      q: 'O que é o Clube Fidelidade Bagy?',
      a: 'É o programa oficial de recompensas e benefícios exclusivos da nossa loja em parceria com a tecnologia do Google Merchant Center. Ao fazer compras na loja ou vincular sua Conta Google, você acumula pontos, desbloqueia níveis mais altos, ganha cashback e tem acesso a preços e frete grátis exclusivos.'
    },
    {
      q: 'Como funciona o Frete Grátis exclusivo para membros no Google Shopping?',
      a: 'Ao navegar pelo Google Shopping ou na busca do Google estando logado na sua Conta Google (mesmo e-mail cadastrado em nossa loja Bagy), os produtos elegíveis exibirão o selo "Frete Grátis com Clube Fidelidade". Membros a partir do nível Prata têm frete grátis em compras a partir de R$ 149, e membros VIP têm Frete Grátis Ilimitado em qualquer pedido.'
    },
    {
      q: 'Como ganho e resgato meus pontos?',
      a: 'A cada compra paga na loja Bagy, você acumula de 1 a 2.5 pontos por real gasto, dependendo do seu nível. No widget flutuante da loja ou na sua conta, você pode trocar seus pontos por cupons de desconto (R$ 15, R$ 30, R$ 50 ou mais) que são aplicados automaticamente na finalização do pedido.'
    },
    {
      q: 'Os pontos expiram?',
      a: 'Os pontos acumulados têm validade de 365 dias corridos a partir da data de crédito do pedido correspondente.'
    },
    {
      q: 'O que acontece em caso de cancelamento ou devolução do pedido?',
      a: 'Caso um pedido seja cancelado ou devolvido, os pontos referentes àquela compra são automaticamente estornados do saldo do membro via webhook integrado.'
    }
  ];

  return (
    <>
      {/* Inject Google Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Programa Oficial de Vantagens
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Bem-vindo ao <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Clube Fidelidade Bagy</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Economize em cada compra na loja e no Google Shopping. Acumule pontos, suba de nível e aproveite Frete Grátis e preços especiais exclusivos para membros.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/bagy-store-demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-sm sm:text-base"
            >
              <UserCheck className="w-4 h-4" />
              Entrar ou Cadastrar Gratuitamente
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-400" /> Frete Grátis p/ Membros
            </span>
            <span className="flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-purple-400" /> Até 18% OFF Exclusivo
            </span>
          </div>
        </div>

        {/* Tiers Comparison Table */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Níveis & Privilégios do Clube</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Quanto mais você compra na loja, mais benefícios desbloqueia automaticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEFAULT_TIERS.map(tier => (
              <div
                key={tier.id}
                className={`glass-card p-6 rounded-2xl flex flex-col justify-between relative border ${
                  tier.label === 'VIP' ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : 'border-white/10'
                }`}
              >
                {tier.label === 'VIP' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Máximo Benefício
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${tier.badgeBg}`}>
                      {tier.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {tier.minPointsToQualify === 0 ? 'Cadastro' : `+${tier.minPointsToQualify} pts`}
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-white">
                      {tier.memberDiscountPercent}% OFF
                    </div>
                    <p className="text-xs text-slate-400">Desconto exclusivo de membro</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <div className="text-[11px] font-mono text-slate-400">
                    Multiplicador: <strong className="text-indigo-300">{tier.pointsMultiplier}x pts/R$</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Points Simulator */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Simulador de Economia do Membro</h3>
              <p className="text-xs text-slate-400">Arraste o valor da sua compra para calcular pontos e descontos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Valor da compra prevista:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                R$ {calcSpend.toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min={50}
              max={2500}
              step={50}
              value={calcSpend}
              onChange={(e) => setCalcSpend(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>R$ 50</span>
              <span>R$ 1.000</span>
              <span>R$ 2.500</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-amber-400 font-bold uppercase">Bronze (1.0x)</div>
              <div className="text-base font-bold text-white">{Math.round(calcSpend * 1.0)} pts</div>
              <div className="text-[10px] text-slate-400">Cashback: R$ {((calcSpend * 0.03)).toFixed(2)}</div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-slate-300 font-bold uppercase">Prata (1.3x)</div>
              <div className="text-base font-bold text-white">{Math.round(calcSpend * 1.3)} pts</div>
              <div className="text-[10px] text-slate-400">Cashback: R$ {((calcSpend * 0.05)).toFixed(2)}</div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-yellow-300 font-bold uppercase">Ouro (1.8x)</div>
              <div className="text-base font-bold text-white">{Math.round(calcSpend * 1.8)} pts</div>
              <div className="text-[10px] text-slate-400">Cashback: R$ {((calcSpend * 0.08)).toFixed(2)}</div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-purple-500/30">
              <div className="text-[11px] text-purple-300 font-bold uppercase">VIP Black (2.5x)</div>
              <div className="text-base font-bold text-white">{Math.round(calcSpend * 2.5)} pts</div>
              <div className="text-[10px] text-slate-400">Cashback: R$ {((calcSpend * 0.12)).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Google Shopping Free Shipping Integration Disclosure */}
        <div className="glass-card p-8 rounded-3xl border border-blue-500/30 bg-blue-950/20 max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Regras de Frete Grátis e Conta Google</h3>
              <p className="text-xs text-blue-200">Em conformidade com a Central de Ajuda do Google Merchant Center</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Ao vincular sua Conta Google com o mesmo e-mail utilizado na Aura Store Bagy, os benefícios de Frete Grátis e descontos são reconhecidos instantaneamente nos resultados de busca do Google e na aba Shopping, sem necessidade de inserir cupons manuais na hora da descoberta do produto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-xs">
              <div className="text-slate-400">Nível Bronze:</div>
              <div className="font-semibold text-white">Frete Grátis acima de R$ 199</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-xs">
              <div className="text-slate-400">Nível Prata & Ouro:</div>
              <div className="font-semibold text-white">Frete Grátis acima de R$ 99 a R$ 149</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/30 text-xs">
              <div className="text-purple-300">Nível VIP Black:</div>
              <div className="font-semibold text-white">Frete Grátis Ilimitado (Sem mínimo)</div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Perguntas Frequentes (FAQ)</h2>
            <p className="text-xs text-slate-400">Tire suas dúvidas sobre o funcionamento do Clube Fidelidade</p>
          </div>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-xl border border-white/10 overflow-hidden cursor-pointer"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="p-4 sm:p-5 flex items-center justify-between text-left">
                <span className="font-medium text-sm sm:text-base text-white">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </div>
              {openFaq === index && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal Disclaimer Required by Google */}
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-8 text-center text-xs text-slate-500 space-y-2">
          <p>
            © {new Date().getFullYear()} Aura Store Bagy - Programa de Fidelidade homologado para Google Merchant Center.
          </p>
          <p>
            Os pontos e benefícios são pessoais, intransferíveis e sujeitos ao regulamento interno da loja.
            Consulte nossos termos de serviço e política de privacidade para mais detalhes.
          </p>
        </div>
      </div>
    </>
  );
}
