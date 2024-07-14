'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from 'react-hot-toast';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
