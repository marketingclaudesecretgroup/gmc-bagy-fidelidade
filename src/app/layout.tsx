import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Clube Fidelidade Secret Outlet & Google Merchant Center (118399377)',
  description: 'Sistema completo de fidelidade integrado à Bagy e Google Merchant Center da Secret Outlet com Frete Grátis exclusivo para membros e atributos oficiais loyalty_program.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
