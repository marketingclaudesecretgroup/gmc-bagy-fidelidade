'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { ShoppingBag, Truck, Sparkles, Star, Check, ArrowRight, Shield, Tag } from 'lucide-react';
import { INITIAL_PRODUCTS, DEFAULT_TIERS } from '@/lib/services/loyalty-store';
import { ProductCatalogItem } from '@/lib/types/loyalty';

export default function BagyStoreDemoPage() {
  const [cart, setCart] = useState<{ product: ProductCatalogItem; qty: number }[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('VIP');

  // Seed default product in cart for easy testing
  useEffect(() => {
    if (INITIAL_PRODUCTS.length > 0) {
      setCart([{ product: INITIAL_PRODUCTS[0], qty: 1 }]);
    }
  }, []);

  const addToCart = (product: ProductCatalogItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice ?? item.product.regularPrice) * item.qty, 0);

  // Free shipping check for VIP or over R$ 149
  const isFreeShipping = selectedTier === 'VIP' || subtotal >= 149;
  const shippingCost = isFreeShipping ? 0 : 25.00;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    if (code.includes('50') || code.includes('GOLD')) {
      setAppliedDiscount(50.00);
      setCouponFeedback('Cupom VIP de R$ 50,00 aplicado com sucesso!');
    } else if (code.includes('30')) {
      setAppliedDiscount(30.00);
      setCouponFeedback('Cupom de R$ 30,00 aplicado com sucesso!');
    } else if (code.includes('20')) {
      setAppliedDiscount(20.00);
      setCouponFeedback('Cupom de R$ 20,00 aplicado com sucesso!');
    } else if (code.includes('15')) {
      setAppliedDiscount(15.00);
      setCouponFeedback('Cupom de R$ 15,00 aplicado com sucesso!');
    } else {
      setAppliedDiscount(25.00);
      setCouponFeedback(`Cupom ${code} validado na API Bagy! Desconto aplicado.`);
    }
  };

  return (
    <>
      {/* Inject Bagy Store Loyalty Widget Script */}
      <Script src="/widget/bagy-loyalty.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Bagy Storefront Simulation Header */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-white/10 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-purple-600/30">
              SO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Secret Outlet Storefront Demo</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase font-semibold border border-emerald-500/30">
                  GMC 118399377
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Catálogo real da Secret Outlet sincronizado com o Google Merchant Center e o Widget Flutuante de Fidelidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Simular Tier:</span>
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-white/10">
              {['BRONZE', 'PRATA', 'OURO', 'VIP'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedTier === tier
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Store Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-white/10 p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Google Shopping Member Benefits
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Você está navegando como membro do Clube Fidelidade
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Aproveite preços especiais para membros, pontos a cada compra e Frete Grátis exclusivo nos produtos elegíveis.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div className="text-xs text-slate-400">Seu Tier Ativo</div>
              <div className="text-sm font-bold text-indigo-400">{selectedTier}</div>
            </div>
          </div>
        </div>

        {/* Layout: Products Grid + Cart / Checkout Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                Catálogo Bagy Sincronizado com GMC
              </h3>
              <span className="text-xs text-slate-400">{INITIAL_PRODUCTS.length} produtos disponíveis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {INITIAL_PRODUCTS.map(product => {
                const baseEffectivePrice = product.salePrice ?? product.regularPrice;
                // Member discount based on selected tier
                const discountPct = selectedTier === 'VIP' ? 18 : selectedTier === 'OURO' ? 12 : selectedTier === 'PRATA' ? 8 : 5;
                const memberPrice = baseEffectivePrice * (1 - discountPct / 100);
                const cashback = baseEffectivePrice * (selectedTier === 'VIP' ? 0.12 : 0.05);

                return (
                  <div key={product.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageLink}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-purple-900/90 text-purple-200 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                          Preço Membro {selectedTier}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Frete Grátis Clube
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">{product.brand}</div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{product.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{product.description}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="text-xs text-slate-500 line-through">
                              R$ {product.regularPrice.toFixed(2)}
                            </div>
                            <div className="text-lg font-extrabold text-emerald-400">
                              R$ {memberPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-indigo-300 font-mono block">
                              +{Math.round(memberPrice * (selectedTier === 'VIP' ? 2.5 : 1))} pts
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Cashback: R$ {cashback.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Adicionar ao Carrinho Bagy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Checkout Simulator */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 sticky top-28">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  Carrinho de Compras
                </h3>
                <span className="text-xs text-slate-400 font-mono">{cart.length} itens</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Seu carrinho está vazio. Adicione produtos do catálogo!
                </div>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-white truncate">{item.product.title}</div>
                        <div className="text-slate-400 font-mono">
                          {item.qty}x R$ {(item.product.salePrice ?? item.product.regularPrice).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Input */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  Cupom de Fidelidade Bagy
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="coupon_code"
                    name="coupon"
                    placeholder="Cole seu cupom (ex: VIP-GOLD-7X9B)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bagy-coupon-input flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {couponFeedback && (
                  <p className="text-[11px] text-emerald-400 font-medium">{couponFeedback}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Dica: Clique no botão flutuante roxo no canto inferior direito para resgatar cupons gerados na API!
                </p>
              </div>

              {/* Order Summary */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">R$ {subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto do Cupom:</span>
                    <span className="font-mono">- R$ {appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-blue-400" />
                    Frete:
                  </span>
                  {isFreeShipping ? (
                    <span className="text-emerald-400 font-semibold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Grátis (Benefício Google/Bagy)
                    </span>
                  ) : (
                    <span className="font-mono text-white">R$ {shippingCost.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-3">
                  <span>Total Final:</span>
                  <span className="font-mono text-emerald-400 text-base">R$ {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Simulação Bagy Checkout: Pedido de R$ ${grandTotal.toFixed(2)} finalizado com sucesso!`)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                Finalizar no Checkout Bagy
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
