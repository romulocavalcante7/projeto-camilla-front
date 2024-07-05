'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
