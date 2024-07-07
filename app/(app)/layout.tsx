'use client';
import { Menu } from '@/components/menu-app';
import { Navbar } from '@/components/navbar';
import { Suspense } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex-1 pb-32">
        <Menu />
        <Suspense fallback={<></>}>{children}</Suspense>
        <Navbar />
      </div>
    </main>
  );
}
