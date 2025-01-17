'use client';
import React from 'react';
import { Suspense, useEffect } from 'react';
import { Menu } from '@/components/menu-app';
import { Navbar } from '@/components/navbar';
import useSocketStore from '@/store/useSocketStore';
import useUserStore from '@/store/useUserStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const connectToSocket = useSocketStore((state) => state.connectToSocket);
  const listenToEvent = useSocketStore((state) => state.listenToEvent);
  const setActiveUsers = useUserStore((state) => state.setActiveUsers);

  useEffect(() => {
    connectToSocket();

    listenToEvent('activeUsers', (count: number) => {
      setActiveUsers(count);
    });
  }, [connectToSocket, listenToEvent, setActiveUsers]);

  return (
    <main className="">
      <div className="relative mx-auto max-w-7xl flex-1 pb-32">
        <Menu />
        <Suspense fallback={<></>}>{children}</Suspense>
        <Navbar />
      </div>
    </main>
  );
}
