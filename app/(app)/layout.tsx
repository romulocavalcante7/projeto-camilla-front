'use client';
import { Navbar } from '@/components/navbar';
import useAuthentication from '@/hooks/useAuthentication';
import { Suspense } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useAuthentication();
  return (
    <main>
      <div className="flex-1 pb-20">
        <Suspense fallback={<></>}>{children}</Suspense>
        <Navbar />
      </div>
    </main>
  );
}
