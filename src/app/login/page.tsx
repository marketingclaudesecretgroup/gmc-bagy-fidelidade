'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Shield, User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function LoginForm() {
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
      setErrorMsg('Informe seu e-mail');
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
      setErrorMsg(result.error || 'Erro ao efetuar login');
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
    const result = await loginWithGoogle('carolina.mendes@gmail.com', 'Carolina Mendes Ramos');
    setLoading(false);

    if (result.success) {
      const target = redirectTarget || '/membro';
      router.push(target);
    } else {
      setErrorMsg(result.error || 'Falha no login com Google');
    }
  };

  const quickLoginAsAdmin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await login('admin@secretoutlet.com.br');
    setLoading(false);
    if (result.success) {
      router.push('/admin');
    }
  };

  const quickLoginAsMember = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await login('carolina.mendes@gmail.com');
    setLoading(false);
    if (result.success) {
      router.push('/membro');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Clube Fidelidade Secret Outlet
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Acesse sua Conta
        </h1>
        <p className="text-xs text-slate-400">
          Gerencie seus pontos, resgate cupons e aproveite Frete Grátis exclusivo
        </p>
      </div>

      {/* Main Glass Auth Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        {/* Google Social Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-md disabled:opacity-50"
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

        <div className="flex items-center gap-2 text-[11px] text-blue-300 bg-blue-950/40 border border-blue-500/20 p-2.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Vínculo automático para exibir Frete Grátis e Preços VIP no Google Shopping.</span>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#0f172a] px-3 text-[11px] font-mono text-slate-500 uppercase">
            ou use e-mail
          </span>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta (+100 pts)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">E-mail Cadastrado</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: seuemail@gmail.com"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 pl-9 focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">Senha</label>
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
                  placeholder="seuemail@gmail.com"
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
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Quick Demo Login Switcher */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Acesso Rápido para Avaliação & Teste:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={quickLoginAsAdmin}
            disabled={loading}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <span>Equipe Lojista</span>
              <Shield className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-[11px] font-mono text-white mt-1">admin@secretoutlet.com.br</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Acesso completo ao Admin & Feeds GMC</div>
          </button>

          <button
            onClick={quickLoginAsMember}
            disabled={loading}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/30 text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span>Cliente Membro VIP</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-[11px] font-mono text-white mt-1">carolina.mendes@gmail.com</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Portal do Membro, Extrato e Cupons</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        <span>Carregando login...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
