'use client';

import React from 'react';
import { LoyaltyMember, BagyCoupon } from '@/lib/types/loyalty';
import { Users, Tag, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

interface MembersTableProps {
  members: LoyaltyMember[];
  coupons: BagyCoupon[];
}

export function MembersTable({ members, coupons }: MembersTableProps) {
  return (
    <div className="space-y-8">
      {/* Members Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Base de Clientes Fidelizados ({members.length})
            </h3>
            <p className="text-xs text-slate-400">Clientes sincronizados via Webhooks da Bagy ou cadastro no checkout</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 uppercase font-mono text-[11px] text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Nível (Tier)</th>
                <th className="py-3 px-4">Saldo de Pontos</th>
                <th className="py-3 px-4">Pedidos Bagy</th>
                <th className="py-3 px-4">Total Gasto (LTV)</th>
                <th className="py-3 px-4">Conta Google</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {member.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      member.tier === 'VIP' ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' :
                      member.tier === 'OURO' ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/40' :
                      member.tier === 'PRATA' ? 'bg-slate-800 text-slate-200 border border-slate-600' :
                      'bg-amber-950/80 text-amber-300 border border-amber-600'
                    }`}>
                      {member.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {member.pointsBalance.toLocaleString()} pts
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {member.totalOrdersCount} pedidos
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    R$ {member.totalSpendBrl.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {member.googleAccountLinked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Vinculada
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Pendente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupons Generated Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Cupons Gerados na API Bagy ({coupons.length})
            </h3>
            <p className="text-xs text-slate-400">Cupons criados automaticamente quando membros resgatam pontos</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 uppercase font-mono text-[11px] text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Código do Cupom</th>
                <th className="py-3 px-4">Beneficiário</th>
                <th className="py-3 px-4">Desconto</th>
                <th className="py-3 px-4">Gasto Mínimo</th>
                <th className="py-3 px-4">Pontos Queimados</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {coupon.memberEmail}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                    R$ {coupon.value.toFixed(2)} OFF
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    R$ {coupon.minCartValue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-400">
                    {coupon.pointsSpent} pts
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      coupon.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-white/5'
                    }`}>
                      {coupon.status === 'ACTIVE' ? 'Pronto p/ Uso' : 'Utilizado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
