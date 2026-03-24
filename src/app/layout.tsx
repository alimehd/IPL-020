import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import ServicesTicker from '@/components/ServicesTicker';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IPL Jaanimmarik Garage — Kuujjuaq',
  description:
    'Book appointments for your Ski-Doo, Honda, car, or truck at IPL Jaanimmarik Garage in Kuujjuaq. Oil changes, tire appointments, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6edd3]">
        <Header />
        <ServicesTicker />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

        {/* Fixed admin side tab */}
        <Link
          href="/admin"
          className="fixed top-1/2 -translate-y-1/2 right-0 z-50 flex flex-col items-center gap-2 bg-[#799351] hover:bg-[#6b8448] text-white px-3 py-5 rounded-l-2xl shadow-xl transition-all hover:px-4 group"
          title="Admin Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Admin
          </span>
        </Link>
        <footer className="border-t border-[#a1dd70]/30 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-[#799351]">
            <p className="font-semibold">IPL Jaanimmarik Garage — Kuujjuaq, Nunavik</p>
            <p className="mt-1 text-xs text-[#799351]/70">
              Open Monday – Friday · 9:00 AM – 4:00 PM
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
