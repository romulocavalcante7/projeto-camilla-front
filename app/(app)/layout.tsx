'use client';
import { Navbar } from '@/components/navbar';
import useAuthentication from '@/hooks/useAuthentication';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useAuthentication();
  return (
    <main className="px-5">
      <div className="mb-20 flex-1">{children}</div>
      <Navbar />
    </main>
  );
}
