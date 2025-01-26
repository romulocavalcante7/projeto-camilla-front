'use client';
import React, { useContext } from 'react';
import { Suspense, useEffect } from 'react';
import { Menu } from '@/components/menu-app';
import { Navbar } from '@/components/navbar';
import useSocketStore from '@/store/useSocketStore';
import useUserStore from '@/store/useUserStore';
import AuthContext from '@/contexts/auth-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { updateOrderStatus } = useContext(AuthContext);
  const connectToSocket = useSocketStore((state) => state.connectToSocket);
  const listenToEvent = useSocketStore((state) => state.listenToEvent);
  const setActiveUsers = useUserStore((state) => state.setActiveUsers);

  useEffect(() => {
    updateOrderStatus();
    connectToSocket();

    listenToEvent('activeUsers', (count: number) => {
      setActiveUsers(count);
    });
  }, [connectToSocket, listenToEvent, setActiveUsers]);

  return (
    <main className="">
      <div className="relative mx-auto max-w-7xl flex-1">
        <Menu />
        <Suspense fallback={<></>}>{children}</Suspense>
        <Navbar />
      </div>
    </main>
  );
}
