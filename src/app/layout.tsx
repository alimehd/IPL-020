import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'PWT Jaanimmarik Garage — Kuujjuaq',
  description:
    'Book appointments for your Ski-Doo, Honda, car, or truck at PWT Jaanimmarik Garage in Kuujjuaq. Oil changes, tire appointments, and more.',
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
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-[#a1dd70]/30 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-[#799351]">
            <p className="font-semibold">PWT Jaanimmarik Garage — Kuujjuaq, Nunavik</p>
            <p className="mt-1 text-xs text-[#799351]/70">
              Open Monday – Friday · 9:00 AM – 4:00 PM
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
