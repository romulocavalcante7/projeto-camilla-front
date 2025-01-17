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
  title: 'VISALASH PRO',
  description: 'VISALASH PRO',
  keywords: ['VISALASH PRO'],
  creator: 'Milla',
  manifest: '/manifest.webmanifest',
  icons: [
    { rel: 'apple-touch-icon', url: 'ios/1024.png' },
    { rel: 'icon', url: 'ios/1024.png' }
  ]
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className="min-h-screen bg-black bg-[url('/mobile.png')] bg-cover bg-[center_bottom_1rem] bg-no-repeat md:bg-[url('/desktop.png')] md:bg-[0px]"
      suppressHydrationWarning
    >
      <body className={`${inter.className} dark:bg-dark-gradient`}>
        <NextTopLoader showSpinner color="#fff" />
        <Providers>
          <Toaster />
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
