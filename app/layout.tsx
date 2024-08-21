import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portal Story Plus',
  description:
    'Portal Story Plus - A sua plataforma completa para figurinhas! Copie e cole figurinhas diretamente nos seus stories, altere cores, ajuste a opacidade e favorite suas figurinhas preferidas sem precisar baixar nada no celular. Torne seus stories únicos e criativos de forma prática e rápida!',
  keywords: ['Valquiria Brito', 'Story', 'Story Plus', 'Figurinhas'],
  creator: 'Valquiria Brito',
  manifest: '/manifest.webmanifest'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="min-h-screen" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-dark-gradient`}>
        <NextTopLoader showSpinner color="#B743D0" />
        <Providers>
          <Toaster />
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
