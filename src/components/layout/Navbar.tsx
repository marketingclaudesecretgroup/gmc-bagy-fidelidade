'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Sparkles, Shield, User, LogOut, ExternalLink } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm lg:text-base tracking-tight text-white">Secret Outlet</span>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Clube Oficial
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Programa de Fidelidade & Vantagens</p>
            </div>
          </Link>
        </div>

        {/* Navigation & Contextual Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/clube-fidelidade"
            className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors hidden sm:block"
          >
            Regulamento & Tiers
          </Link>

          {/* If authenticated as ADMIN */}
          {isAuthenticated && role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/40 hover:bg-purple-900 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Painel Admin
            </Link>
          )}

          {/* If authenticated as MEMBER */}
          {isAuthenticated && role !== 'ADMIN' && (
            <Link
              href="/membro"
              className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Meu Saldo
              {user?.pointsBalance !== undefined && (
                <span className="font-mono text-emerald-400 font-bold ml-1">{user.pointsBalance.toLocaleString()} pts</span>
              )}
            </Link>
          )}

          {/* User Session Switcher or Login Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name.split(' ')[0]}</div>
                <div className="text-[10px] font-mono text-indigo-400 uppercase">{user.role === 'ADMIN' ? 'Admin' : (user.tier || 'Membro')}</div>
              </div>

              <button
                onClick={() => logout()}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-white/10 transition-colors"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Entrar no Clube
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
