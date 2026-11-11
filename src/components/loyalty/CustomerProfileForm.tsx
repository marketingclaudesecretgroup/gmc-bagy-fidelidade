'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Search,
  Bell,
  Heart,
  Shirt,
  Check
} from 'lucide-react';
import { CustomerProfile } from '@/lib/types/loyalty';

interface CustomerProfileFormProps {
  initialProfile?: CustomerProfile | null;
  userEmail: string;
  userName?: string;
  onProfileUpdated?: (updatedMember: any, bonusAwarded: boolean) => void;
}

const UF_LIST = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const BRANDS_LIST = [
  'Lacoste',
  'Reserva',
  'Aramis',
  'Tommy Hilfiger',
  'Calvin Klein',
  'John John',
  'Hugo Boss',
  'Sergio K',
  'Dudalina',
  'Ricardo Almeida'
];

const SHIRT_SIZES = ['P', 'M', 'G', 'GG', 'XGG', 'XXGG'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];

export default function CustomerProfileForm({
  initialProfile,
  userEmail,
  userName,
  onProfileUpdated
}: CustomerProfileFormProps) {
  const [cpf, setCpf] = useState(initialProfile?.cpf || '');
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate || '');
  const [gender, setGender] = useState<string>(initialProfile?.gender || 'M');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  
  // Address
  const [cep, setCep] = useState(initialProfile?.address?.cep || '');
  const [street, setStreet] = useState(initialProfile?.address?.street || '');
  const [number, setNumber] = useState(initialProfile?.address?.number || '');
  const [complement, setComplement] = useState(initialProfile?.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(initialProfile?.address?.neighborhood || '');
  const [city, setCity] = useState(initialProfile?.address?.city || '');
  const [state, setState] = useState(initialProfile?.address?.state || 'SP');

  // Preferences
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>(
    initialProfile?.favoriteBrands || ['Lacoste', 'Reserva']
  );
  const [shirtSize, setShirtSize] = useState(initialProfile?.preferredSizes?.shirts || 'M');
  const [shoeSize, setShoeSize] = useState(initialProfile?.preferredSizes?.shoes || '41');

  // Communication
  const [receiveWhatsapp, setReceiveWhatsapp] = useState(
    initialProfile?.receiveWhatsappNotifications ?? true
  );
  const [receiveEmail, setReceiveEmail] = useState(
    initialProfile?.receiveEmailNotifications ?? true
  );

  // Status
  const [loadingCep, setLoadingCep] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (initialProfile) {
      if (initialProfile.cpf) setCpf(initialProfile.cpf);
      if (initialProfile.birthDate) setBirthDate(initialProfile.birthDate);
      if (initialProfile.gender) setGender(initialProfile.gender);
      if (initialProfile.phone) setPhone(initialProfile.phone);
      if (initialProfile.address) {
        if (initialProfile.address.cep) setCep(initialProfile.address.cep);
        if (initialProfile.address.street) setStreet(initialProfile.address.street);
        if (initialProfile.address.number) setNumber(initialProfile.address.number);
        if (initialProfile.address.complement) setComplement(initialProfile.address.complement);
        if (initialProfile.address.neighborhood) setNeighborhood(initialProfile.address.neighborhood);
        if (initialProfile.address.city) setCity(initialProfile.address.city);
        if (initialProfile.address.state) setState(initialProfile.address.state);
      }
      if (initialProfile.favoriteBrands) setFavoriteBrands(initialProfile.favoriteBrands);
      if (initialProfile.preferredSizes?.shirts) setShirtSize(initialProfile.preferredSizes.shirts);
      if (initialProfile.preferredSizes?.shoes) setShoeSize(initialProfile.preferredSizes.shoes);
    }
  }, [initialProfile]);

  // Masking helpers
  const formatCpf = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw ? `(${raw}` : '';
    if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
  };

  const formatCep = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  };

  // ViaCEP lookup
  const handleCepSearch = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      setFeedback({ type: 'error', message: 'Por favor, digite um CEP válido com 8 dígitos.' });
      return;
    }

    setLoadingCep(true);
    setFeedback(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) {
        setFeedback({ type: 'error', message: 'CEP não encontrado. Por favor, preencha o endereço manualmente.' });
      } else {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        if (data.uf && UF_LIST.includes(data.uf)) {
          setState(data.uf);
        }
        setFeedback({ type: 'success', message: 'Endereço localizado com sucesso via Correios / ViaCEP!' });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Não foi possível consultar o CEP automaticamente. Preencha os campos abaixo.' });
    } finally {
      setLoadingCep(false);
    }
  };

  const toggleBrand = (b: string) => {
    if (favoriteBrands.includes(b)) {
      setFavoriteBrands(favoriteBrands.filter(x => x !== b));
    } else {
      setFavoriteBrands([...favoriteBrands, b]);
    }
  };

  // Profile completion calculation
  const isCpfValid = cpf.replace(/\D/g, '').length === 11;
  const isBirthValid = birthDate.length >= 8;
  const isPhoneValid = phone.replace(/\D/g, '').length >= 10;
  const isAddressValid = Boolean(cep && street && number && city && state);

  const completionChecks = [isCpfValid, isBirthValid, isPhoneValid, isAddressValid, favoriteBrands.length > 0];
  const completedCount = completionChecks.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionChecks.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCpfValid) {
      setFeedback({ type: 'error', message: 'Por favor, informe um CPF válido com 11 dígitos para cadastro no Brasil.' });
      return;
    }

    if (!birthDate) {
      setFeedback({ type: 'error', message: 'Informe sua data de nascimento para garantir seus presentes e bônus de aniversário.' });
      return;
    }

    if (!isAddressValid) {
      setFeedback({ type: 'error', message: 'Preencha o CEP, Logradouro, Número, Cidade e Estado para envio e frete grátis.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const updatedProfile: Partial<CustomerProfile> = {
      cpf,
      birthDate,
      gender: gender as any,
      phone,
      address: {
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state
      },
      favoriteBrands,
      preferredSizes: {
        shirts: shirtSize,
        shoes: shoeSize
      },
      receiveWhatsappNotifications: receiveWhatsapp,
      receiveEmailNotifications: receiveEmail,
      profileCompleted: true
    };

    try {
      const res = await fetch('/api/loyalty/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          profile: updatedProfile
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'Perfil atualizado com sucesso!'
        });
        if (onProfileUpdated) {
          onProfileUpdated(data.member, data.bonusAwarded);
        }
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Falha ao salvar perfil.'
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: 'Erro ao conectar ao servidor. Tente novamente.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and completion score */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                Cadastro Oficial Brasil 🇧🇷
              </span>
              <span className="text-xs text-slate-400">| Secret Outlet</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Perfil do Cliente & Dados Cadastrais
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Preencha seus dados de identificação, endereço para cálculo de frete grátis e preferências de estilo. Ganhe <strong>+150 pontos de bônus imediato</strong> ao completar seu perfil!
            </p>
          </div>

          {/* Progress Pill */}
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 w-full md:w-56 text-center space-y-2">
            <div className="flex items-center justify-between w-full text-xs font-semibold text-slate-300">
              <span>Progresso</span>
              <span className="text-emerald-400 font-mono font-bold">{completionPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-400">
              {completionPercent === 100 ? (
                <span className="text-emerald-300 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Perfil 100% Completo!
                </span>
              ) : (
                <span>Complete os dados e ganhe <strong>+150 pts</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-sm flex items-center gap-3 border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
            : 'bg-red-950/60 border-red-500/50 text-red-200'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Identificação Pessoal */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              1. Identificação Pessoal & Fiscal
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Informações necessárias para faturamento de compras e emissão de Nota Fiscal Eletrônica (NF-e).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                disabled
                value={userName || userEmail.split('@')[0]}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Vinculado à conta do clube</span>
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail do Membro
              </label>
              <input
                type="email"
                disabled
                value={userEmail}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Identificador na Secret Outlet e Google</span>
            </div>

            {/* CPF */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CPF <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono transition-colors"
                maxLength={14}
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Obrigatório para emissão de Nota Fiscal no Brasil</span>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Data de Nascimento <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white transition-colors"
                  required
                />
              </div>
              <span className="text-[11px] text-purple-400 font-medium mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ganhe cupom de 15% OFF e +200 pontos no seu aniversário!
              </span>
            </div>

            {/* Telefone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp / Celular <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono transition-colors"
                maxLength={15}
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Para avisos de entrega, rastreio e saldo de cashback</span>
            </div>

            {/* Gênero */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gênero
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white transition-colors"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="OTHER">Outro</option>
                <option value="PREFER_NOT_TO_SAY">Prefiro não informar</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Para recomendações de peças personalizadas</span>
            </div>
          </div>
        </div>

        {/* Section 2: Endereço de Entrega no Brasil */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              2. Endereço de Entrega no Brasil
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Endereço padrão para cálculo imediato de Frete Grátis exclusivo de membro e despacho rápido na Secret Outlet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* CEP com Busca Automática */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CEP <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono transition-colors"
                  maxLength={9}
                  required
                />
                <button
                  type="button"
                  onClick={handleCepSearch}
                  disabled={loadingCep}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  title="Buscar endereço pelo CEP"
                >
                  {loadingCep ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Buscar</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Busca automática via Correios / ViaCEP</span>
            </div>

            {/* Logradouro / Rua */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Logradouro (Rua, Avenida, Alameda) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Rua Bela Cintra"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                required
              />
            </div>

            {/* Número */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Número <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: 1240"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono transition-colors"
                required
              />
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Complemento
              </label>
              <input
                type="text"
                placeholder="Ex: Apto 82, Bloco B"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bairro <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Jardins"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                required
              />
            </div>

            {/* Cidade */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cidade <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
                required
              />
            </div>

            {/* Estado / UF */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estado (UF) <span className="text-rose-400">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono transition-colors"
                required
              >
                {UF_LIST.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Preferências de Estilo & Marcas Secret Outlet */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shirt className="w-5 h-5 text-purple-400" />
              3. Preferências de Moda & Marcas Favoritas
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Personalize as promoções antecipadas para suas marcas prediletas e receba alertas de estoque no seu tamanho.
            </p>
          </div>

          <div className="space-y-6">
            {/* Tamanhos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tamanho para Camisas, Camisetas e Polos
                </label>
                <div className="flex flex-wrap gap-2">
                  {SHIRT_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setShirtSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        shirtSize === sz
                          ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tamanho para Calçados & Tênis
                </label>
                <div className="flex flex-wrap gap-2">
                  {SHOE_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setShoeSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                        shoeSize === sz
                          ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Marcas Favoritas */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Marcas Favoritas na Secret Outlet (clique para selecionar)
              </label>
              <div className="flex flex-wrap gap-2">
                {BRANDS_LIST.map((brand) => {
                  const isSelected = favoriteBrands.includes(brand);
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-sm'
                          : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Comunicação & Notificações */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            4. Canais de Notificação de Vantagens
          </h3>

          <div className="space-y-3 pt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={receiveWhatsapp}
                onChange={(e) => setReceiveWhatsapp(e.target.checked)}
                className="w-4 h-4 text-emerald-500 bg-slate-900 border-white/20 rounded focus:ring-emerald-400"
              />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                Receber cupons exclusivos, confirmação de cashback e rastreio de entrega via <strong>WhatsApp</strong>.
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={receiveEmail}
                onChange={(e) => setReceiveEmail(e.target.checked)}
                className="w-4 h-4 text-indigo-500 bg-slate-900 border-white/20 rounded focus:ring-indigo-400"
              />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                Receber lançamentos antecipados e promoções de parceiros Secret Outlet por <strong>E-mail</strong>.
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dados protegidos pela LGPD com criptografia ponta a ponta.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvando Perfil...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Perfil Brasil (+150 pts de bônus)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
