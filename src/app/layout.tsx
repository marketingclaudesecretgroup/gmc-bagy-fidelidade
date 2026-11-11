import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Clube Fidelidade Bagy & Google Merchant Center Hub',
  description: 'Sistema completo de fidelidade integrado à Bagy e Google Merchant Center com Frete Grátis exclusivo para membros e atributos oficiais loyalty_program.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm lg:text-base tracking-tight text-white">Bagy Fidelidade</span>
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">GMC Native</span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">Google Shopping Loyalty & Bagy Engine</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/admin"
                className="text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Painel Admin
              </Link>

              <Link
                href="/bagy-store-demo"
                className="text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                Demo Loja Bagy
              </Link>

              <Link
                href="/clube-fidelidade"
                className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
              >
                Landing Page Google
              </Link>
            </div>
          </div>
        </nav>

        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
