'use client';

import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, ExternalLink, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, FileCode } from 'lucide-react';

export function FeedManager() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [xmlSnippet, setXmlSnippet] = useState<string>('');

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gmc/validate');
      const data = await res.json();
      setAuditData(data);

      const xmlRes = await fetch('/api/gmc/feed.xml');
      const xmlText = await xmlRes.text();
      setXmlSnippet(xmlText.split('\n').slice(0, 35).join('\n'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const xmlUrl = `${origin}/api/gmc/feed.xml`;
  const tsvUrl = `${origin}/api/gmc/feed.tsv`;

  return (
    <div className="space-y-6">
      {/* Top Feed Endpoints Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              Feeds do Google Merchant Center
            </h3>
            <p className="text-xs text-slate-400">
              Copie as URLs abaixo e configure diretamente como Feed Primário ou Feed Complementar no GMC.
            </p>
          </div>

          <button
            onClick={fetchAudit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Diagnóstico
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* XML Feed */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Feed RSS 2.0 XML (Recomendado)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Ativo</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-white/5">
              <input
                type="text"
                readOnly
                value={xmlUrl}
                className="bg-transparent text-xs font-mono text-slate-300 flex-1 outline-none truncate"
              />
              <button
                onClick={() => copyToClipboard(xmlUrl, 'xml')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                {copiedType === 'xml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'xml' ? 'Copiado' : 'Copiar'}
              </button>
              <a
                href="/api/gmc/feed.xml"
                target="_blank"
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                title="Abrir XML"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TSV Feed */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Feed TSV Tab-Delimited
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Ativo</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-white/5">
              <input
                type="text"
                readOnly
                value={tsvUrl}
                className="bg-transparent text-xs font-mono text-slate-300 flex-1 outline-none truncate"
              />
              <button
                onClick={() => copyToClipboard(tsvUrl, 'tsv')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                {copiedType === 'tsv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'tsv' ? 'Copiado' : 'Copiar'}
              </button>
              <a
                href="/api/gmc/feed.tsv"
                target="_blank"
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                title="Abrir TSV"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score & Google Compliance */}
      {auditData?.audit && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Índice de Qualidade do Feed GMC</div>
              <div className="text-4xl font-black text-emerald-400 font-mono mt-1">
                {auditData.audit.score} / 100
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Status: <strong className="text-emerald-300 font-semibold">{auditData.audit.status}</strong>. Todos os atributos mandatórios de <code className="text-indigo-300">loyalty_program</code> foram validados.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Produtos com fidelidade:</span>
                <span className="font-mono text-white">{auditData.audit.stats.productsWithLoyalty} / {auditData.audit.stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Níveis de fidelidade mapeados:</span>
                <span className="font-mono text-white">{auditData.audit.stats.activeTiersCount} (Bronze, Prata, Ouro, VIP)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rótulo de envio (shipping_label):</span>
                <span className="font-mono text-emerald-400">Ativo</span>
              </div>
            </div>
          </div>

          {/* Raw XML Snippet Preview */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Pré-visualização do XML gerado para o Google
              </span>
              <span className="text-[10px] font-mono text-slate-400">Mostrando primeiras 35 linhas</span>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-64 border border-white/5 selection:bg-indigo-600">
              {xmlSnippet || 'Carregando XML...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
