import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Story Plus',
  description: 'Story Plus'
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
