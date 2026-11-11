'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Percent,
  CheckCircle2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Gift,
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const { login, loginWithGoogle, register, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      if (redirectTarget) {
        router.push(redirectTarget);
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/membro');
      }
    }
  }, [isAuthenticated, role, redirectTarget, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Informe seu e-mail cadastrado');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const target = redirectTarget || (email.includes('admin') ? '/admin' : '/membro');
      router.push(target);
    } else {
      setErrorMsg(result.error || 'Credenciais inválidas. Verifique seu e-mail ou crie uma conta.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Preencha seu nome e e-mail');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    const result = await register(name, email);
    setLoading(false);

    if (result.success) {
      router.push('/membro');
    } else {
      setErrorMsg(result.error || 'Erro ao criar conta');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    // Simulates OAuth flow with Google Profile
    const result = await loginWithGoogle('cliente@gmail.com', 'Cliente Secret Outlet');
    setLoading(false);

    if (result.success) {
      const target = redirectTarget || '/membro';
      router.push(target);
    } else {
      setErrorMsg(result.error || 'Falha na autenticação com a Conta Google');
    }
  };

  const faqs = [
    {
      q: 'Como funciona o Frete Grátis exclusivo no Google Shopping?',
      a: 'Ao vincular sua Conta Google ao Clube Secret Outlet, o Google reconhece sua associação automaticamente. Quando você pesquisar por produtos de moda na aba Google Shopping logado na sua conta, verá o selo oficial "Frete grátis para membros" ou descontos exclusivos.'
    },
    {
      q: 'Como acumulo pontos nas minhas compras?',
      a: 'A cada R$ 1,00 gasto na Secret Outlet em qualquer marca (Lacoste, Reserva, Tommy Hilfiger, Aramis), você ganha de 1.0 a 2.5 pontos dependendo do seu nível. Seus pontos são creditados assim que o pedido é aprovado.'
    },
    {
      q: 'Como utilizo meus cupons de desconto?',
      a: 'No Portal do Membro, você resgata seus pontos por cupons de R$ 15, R$ 30 ou R$ 50 com 1 clique. O código gerado é aplicado diretamente no carrinho ou checkout da nossa loja virtual.'
    },
    {
      q: 'Como funciona o acesso da equipe administradora da loja?',
      a: 'Membros da equipe interna da Secret Outlet entram com seu e-mail corporativo autorizado. O sistema reconhece o perfil e libera o painel administrativo (/admin) com métricas financeiras e gerenciador de feeds GMC.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Landing Explainer */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Programa Oficial de Vantagens Secret Outlet
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Compre, Pontue e Desbloqueie{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Frete Grátis no Google Shopping
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              O Clube de Fidelidade da Secret Outlet integra diretamente com a sua Conta Google. Você acumula pontos a cada compra de marcas originais e desbloqueia preços exclusivos e vantagens logísticas nos anúncios do Google Shopping e na loja virtual.
            </p>
          </div>

          {/* 3 Step Process Grid */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Como Funciona em 3 Passos Simples:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  01
                </div>
                <h3 className="text-xs font-bold text-white">Conecte sua Conta</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Entre com sua Conta Google ou e-mail da Secret Outlet. Ganhe 100 pontos imediatos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  02
                </div>
                <h3 className="text-xs font-bold text-white">Compre & Pontue</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Ganhe pontos em todas as compras e acumule cashback para usar em novos pedidos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  03
                </div>
                <h3 className="text-xs font-bold text-white">Benefícios no Google</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Desbloqueie frete grátis exclusivo exibido diretamente nas buscas do Google.
                </p>
              </div>
            </div>
          </div>

          {/* Tier Overview Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Níveis e Benefícios do Clube
              </h2>
              <Link
                href="/clube-fidelidade"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
              >
                Ver regulamento completo
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-800/40 space-y-1.5">
                <div className="text-[10px] uppercase font-mono font-bold text-amber-400">Bronze</div>
                <div className="text-xs font-bold text-white">Entrada Livre</div>
                <div className="text-[10px] text-slate-400">1x Pts • 3% Cashback</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-600/40 space-y-1.5">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-300">Prata</div>
                <div className="text-xs font-bold text-white">R$ 500 gastos</div>
                <div className="text-[10px] text-slate-400">Frete Grátis &gt; R$ 149</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-yellow-600/40 space-y-1.5">
                <div className="text-[10px] uppercase font-mono font-bold text-yellow-400">Ouro</div>
                <div className="text-xs font-bold text-white">R$ 1.500 gastos</div>
                <div className="text-[10px] text-slate-400">Frete Grátis &gt; R$ 99</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-600/50 space-y-1.5 bg-gradient-to-b from-purple-950/30 to-slate-900/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <div className="text-[10px] uppercase font-mono font-bold text-purple-400">VIP Black</div>
                <div className="text-xs font-bold text-white">R$ 3.500 gastos</div>
                <div className="text-[10px] text-purple-300 font-semibold">Frete Grátis SEM MÍNIMO</div>
              </div>
            </div>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Produtos 100% Originais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Envio para todo o Brasil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-purple-400" />
              <span>Google Merchant Center Homologado</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Authentication Form */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Acesse o Clube Secret Outlet
              </h2>
              <p className="text-xs text-slate-400">
                Entre com sua Conta Google ou e-mail cadastrado
              </p>
            </div>

            {/* Google Primary Sign-In */}
            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continuar com a Conta Google
              </button>
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Recomendado para ativar Frete Grátis nas buscas do Google</span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-[#0f172a] px-3 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                ou com e-mail
              </span>
            </div>

            {/* Tab Selector */}
            <div className="flex p-1 rounded-xl bg-slate-900/90 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Já sou cadastrado
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Criar Conta</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  +100 pts
                </span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300 font-medium">Senha</label>
                    <span className="text-[10px] text-slate-400">Opcional para cliente</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar no Clube'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Nome Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Criar Senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar e Ganhar 100 Pontos'}
                  <Gift className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400">
                Adesão 100% gratuita sem taxas de manutenção ou fidelidade contratual.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section: Explaining how everything works */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Tire suas dúvidas
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Perguntas Frequentes sobre o Clube
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tudo o que você precisa saber sobre pontos, resgates e os benefícios no Google Shopping
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span>Carregando portal de acesso...</span>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
