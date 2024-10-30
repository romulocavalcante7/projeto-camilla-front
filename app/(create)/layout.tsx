'use client';
import React from 'react';
import { Suspense } from 'react';
// import { Menu } from '@/components/menu-app';

export default function CreateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="relative mx-auto max-w-7xl flex-1">
        {/* <Menu /> */}
        <Suspense fallback={<></>}>{children}</Suspense>
      </div>
    </main>
  );
}
