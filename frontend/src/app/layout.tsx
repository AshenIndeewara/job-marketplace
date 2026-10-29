import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { QueryProvider } from '@/providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Job Marketplace',
  description:
    'Part-time jobs in Sri Lanka — find trusted work or hire verified people.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-[--color-primary] focus:text-[--color-primary-foreground]"
        >
          Skip to content
        </a>
        <QueryProvider>
          <Header />
          <main id="main" className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
