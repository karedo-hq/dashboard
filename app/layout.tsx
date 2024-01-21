import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import './globals.css';
import Sidebar from '@/components/layout/sidebar-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wizy',
  description: 'AI-powered product documentation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="bg-white dark:bg-slate-800 relative overflow-hidden flex h-screen ">
            <Sidebar />
            <main className="group w-full pl-0 md:pl-[280px] overflow-auto">
              <Header />
              {children}
              <Toaster />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
